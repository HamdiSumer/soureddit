import logging
from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.operators.python import PythonOperator
from pymongo import MongoClient
from minio import Minio
from minio.error import S3Error
from airflow.models import Variable
from confluent_kafka import Producer
from airflow.exceptions import AirflowSkipException


client_id = Variable.get("client_id")
client_secret = Variable.get("client_secret")
user_agent = Variable.get("user_agent")

mongodb_uri = Variable.get("mongodb_uri")

BUCKET = Variable.get("BUCKET")

minio_endpoint = Variable.get("minio_endpoint")

minio_access_key = Variable.get("minio_access_key")
minio_secret_key = Variable.get("minio_secret_key")

mongo_db = Variable.get("mongo_db")
mongo_collection = Variable.get("mongo_collection")

reddit_credential_dict = {"client_id": client_id,
                          "client_secret": client_secret,
                          "user_agent": user_agent}

# MACROS
execution_date_time = "{{ ts_nodash }}"

# KAFKA
kafka_bootstrap_servers = 'broker:29092'
kafka_topic = 'raw_objects'


def retrieve_subreddits() -> []:
    client = MongoClient(mongodb_uri)

    db = client[mongo_db]
    collection = db[mongo_collection]

    subreddits = list(collection.find())
    client.close()

    subreddit_list = [subreddit['subreddit'] for subreddit in subreddits]

    return subreddit_list


def scrape_and_ingest(bucket, object_name):
    import scraper
    import io

    subreddits = retrieve_subreddits()
    scrape_obj = scraper.Scrape(subreddits=subreddits,
                                reddit_credentials=reddit_credential_dict)
    df_parquet = scrape_obj.perform_scrape()

    if df_parquet is None:
        logging.info('df is empty...')
        raise AirflowSkipException('DataFrame is empty')

    # Upload data to MinIO
    minio_client = Minio(minio_endpoint,
                         access_key=minio_access_key,
                         secret_key=minio_secret_key,
                         secure=False,
                         )  # Set to True if MinIO uses HTTPS

    if not minio_client.bucket_exists(f"{BUCKET}"):
        minio_client.make_bucket(f"{BUCKET}")

    try:
        # Upload the Parquet data directly to MinIO
        minio_client.put_object(bucket, object_name, io.BytesIO(df_parquet), len(df_parquet))
        logging.info(f"Uploaded DataFrame to {bucket}/{object_name}")

    except S3Error as err:
        logging.error(f"MinIO error: {err}")
        raise AirflowSkipException('MinIO Error')


def send_to_kafka(object_name):

    kafka_producer = Producer({'bootstrap.servers': kafka_bootstrap_servers})

    def delivery_report(err, msg):
        """ Called once for each message produced to indicate delivery result.
            Triggered by poll() or flush(). """
        if err is not None:
            logging.info(msg=f'Message delivery failed: {err}')
        else:
            logging.info(msg=f"The object : {object_name} has been inserted to the message queue as : {msg.topic()}")

    logging.info(msg=f"The object : {object_name} is being inserted to the message queue...")
    kafka_producer.poll(0)
    kafka_producer.produce(kafka_topic,
                           key=object_name,
                           value=object_name.encode('utf-8'),
                           callback=delivery_report)


    # send all the messages in the memory
    kafka_producer.flush()
    logging.info(msg="Memory has been flushed")


# Your existing default_args
default_args = {
    "owner": "soureddit",
    "start_date": days_ago(1),
    "depends_on_past": False,
    "retries": 1,
}

# NOTE: DAG declaration - using a Context Manager (an implicit way)
with DAG(
        dag_id="raw_data_ingest",
        schedule_interval="@hourly",
        default_args=default_args,
        catchup=False,
        max_active_runs=1,
        tags=['scrape'],
) as dag:
    scrape_data_task = PythonOperator(
        task_id="scrape_data",
        python_callable=scrape_and_ingest,
        op_kwargs={
            "bucket": BUCKET,
            "object_name": f"raw_{execution_date_time}",
        },
    )

    send_to_kafka_task = PythonOperator(
        task_id="send_to_kafka",
        python_callable=send_to_kafka,
        op_kwargs={
            "object_name": f"raw_{execution_date_time}",
        },
    )

    scrape_data_task >> send_to_kafka_task

