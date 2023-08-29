import io
import logging
from datetime import timedelta, datetime

import pandas as pd
import requests
from airflow.models import Variable
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from cassandra.cluster import Cluster
from confluent_kafka import Consumer
from confluent_kafka import Producer
from minio import Minio
import pyarrow.parquet as pq
from minio.error import S3Error
from minio.commonconfig import CopySource
from airflow import DAG

minio_endpoint = Variable.get("minio_endpoint")
minio_access_key = Variable.get("minio_access_key")
minio_secret_key = Variable.get("minio_secret_key")

BUCKET = Variable.get("BUCKET")
PROCESS_SUCCESSFUL_BUCKET = Variable.get("PROCESS_SUCCESSFUL_BUCKET")
PROCESS_FAILED_BUCKET = Variable.get("PROCESS_FAILED_BUCKET")

kafka_bootstrap_servers = Variable.get("kafka_bootstrap_servers")
kafka_topic = Variable.get("kafka_topic")

API_URL = Variable.get("API_URL")
API_TOKEN = Variable.get("API_TOKEN")

cassandra_host = Variable.get("cassandra_host")
keyspace = Variable.get("keyspace")
table = Variable.get("table")


def summarize_to_cassandra():
    def is_processed(obj_name):
        if not minio_client.bucket_exists(f"{PROCESS_SUCCESSFUL_BUCKET}"):
            minio_client.make_bucket(f"{PROCESS_SUCCESSFUL_BUCKET}")
        try:
            minio_client.copy_object(
                PROCESS_SUCCESSFUL_BUCKET,
                obj_name,
                CopySource(f"{BUCKET}", f"{obj_name}"),
            )

            # If copying is successful, delete object from source bucket
            try:
                minio_client.remove_object(BUCKET, obj_name)
            except S3Error as err:
                logging.info("Error deleting object from source bucket:", err)

        except S3Error as err:
            logging.info("Error copying object:", err)

    def process_failed(obj_name):
        if not minio_client.bucket_exists(f"{PROCESS_FAILED_BUCKET}"):
            minio_client.make_bucket(f"{PROCESS_FAILED_BUCKET}")
        try:
            minio_client.copy_object(
                PROCESS_FAILED_BUCKET,
                obj_name,
                CopySource(f"{BUCKET}", f"{obj_name}"),
            )

            # If copying is successful, delete object from source bucket
            try:
                minio_client.remove_object(BUCKET, obj_name)
            except S3Error as err:
                logging.info("Error deleting object from source bucket:", err)

        except S3Error as err:
            logging.info("Error copying object:", err)

    def process(obj):
        try:
            # Read the Parquet data from the MinIO object
            parquet_stream = io.BytesIO(obj.data)

            # Read the Parquet data into a pyarrow Table
            parquet_table = pq.read_table(parquet_stream)

            # Convert the pyarrow Table to a pandas DataFrame
            df_sum = parquet_table.to_pandas()

            logging.info(msg='df_sum has been created')
        except Exception as e:
            logging.info(msg=f'Exception {e} is occurred while reading minio object as parquet')

        headers = {"Authorization": f"Bearer {API_TOKEN}"}

        total_rows = df_sum.shape[0]

        processed_row_count = 0

        def summarize(row, state):
            payload = {"inputs": row['comments']}
            try:
                response = requests.post(API_URL, headers=headers, json=payload)
            except Exception as e:
                logging.info(msg=f'Exception {e} is occurred while requesting the hugging face')

            if response.status_code == 200:
                # summarize success
                state['processed_row_count'] += 1
                logging.info(f"{state['processed_row_count']}/{state['total_rows']} rows has been processed | summarized.")
                return response.json()[0]['summary_text']
            else:
                state['processed_row_count'] += 1
                logging.info(
                    f"{state['processed_row_count']}/{state['total_rows']}th row returned None.")
                return None

        try:
            total_rows = df_sum.shape[0]
            state_comments = {'processed_row_count': 0, 'total_rows': total_rows}
            df_sum['comments'] = df_sum.apply(summarize, args=(state_comments,), axis=1)
        except Exception as e:
            logging.info(msg=f'Exception {e} is occurred while summarizing comments')

        try:
            state_body = {'processed_row_count': 0, 'total_rows': total_rows}
            df_sum['body'] = df_sum.apply(summarize, args=(state_body,), axis=1)
        except Exception as e:
            logging.info(msg=f'Exception {e} is occurred while summarizing body')

        return df_sum

    def save_to_cassandra(df_cas: pd.DataFrame):
        cluster = Cluster([f'{cassandra_host}'])
        session = cluster.connect()

        # fix df data types
        df_cas['insert_timestamp'] = datetime.now()
        df_cas['body'] = df_cas['body'].str.encode('utf-8')
        df_cas['comments'] = df_cas['comments'].str.encode('utf-8')

        columns = df_cas.columns

        query = f"INSERT INTO {keyspace}.{table} (id, {','.join(map(str, columns))}) VALUES (uuid(), {','.join(map(str, '?' * len(columns)))})"
        prepared = session.prepare(query)

        # # Iterate through rows and insert data into Cassandra table
        for index, row in df_cas.iterrows():
            session.execute(prepared, tuple(row.iloc[range(len(columns))]))

    # get object names to process from the kafka message broker
    c = Consumer({
        'bootstrap.servers': kafka_bootstrap_servers,
        'group.id': 'summarize_consume',
        'auto.offset.reset': 'earliest'
    })

    c.subscribe([kafka_topic])

    null_counter = 0
    msg_list = []

    try:
        while True:
            msg = c.poll(timeout=1)
            if null_counter < 10:
                if msg is None:
                    null_counter += 1
                    continue
                if msg.error():
                    kafka_producer = Producer({'bootstrap.servers': kafka_bootstrap_servers})

                    kafka_producer.poll(0)
                    kafka_producer.produce("dlq",
                                           key=msg.key(),
                                           value=msg.value())

                    continue
                else:
                    # Proper message
                    msg_list.append(msg.value().decode('utf-8'))
            else:
                break

    finally:
        # Close down consumer to commit final offsets.
        c.commit()
        c.close()

    minio_client = Minio(minio_endpoint,
                         access_key=minio_access_key,
                         secret_key=minio_secret_key,
                         secure=False,
                         )

    logging.info(msg=f'The message list retrieved from the kafka is : {msg_list}')

    for message in msg_list:
        # get objects from minio by message name and process

        # get the object
        minio_object = minio_client.get_object(
            bucket_name=f'{BUCKET}',
            object_name=f'{message}'
        )

        try:
            # TODO: diyelim save_to_cassandra çalıştı ama is_processed çalışmadı exceptiona gidiyor işler karışıyor bunu düşün!
            logging.info(f'Starting processing step...')
            df = process(minio_object)
            logging.info(f'Starting save_to_cassandra step...')
            save_to_cassandra(df)
            logging.info(f'Starting is_processed step...')
            is_processed(message)
        except Exception as e:
            logging.info(msg=f'processing failed for the object : {minio_object} the exception is : {e}')
            process_failed(message)


# Your existing default_args
default_args = {
    "owner": "soureddit",
    "start_date": days_ago(1),
    "depends_on_past": False,
    "retries": 1,
}

# NOTE: DAG declaration - using a Context Manager (an implicit way)
with DAG(
        dag_id="summarize_and_ingest",
        schedule_interval=timedelta(minutes=5),
        default_args=default_args,
        catchup=False,
        max_active_runs=1,
        tags=['summarize', 'ingest'],
) as dag:
    process_task = PythonOperator(
        task_id='summarize_to_cassandra',
        python_callable=summarize_to_cassandra,
    )

    process_task
