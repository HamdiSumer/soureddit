import os
# import sys
# import git
import logging
import json

from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.operators.python import PythonOperator
from google.cloud import secretmanager
from pymongo import MongoClient
from google.cloud import storage

# ENV VARIABLES
BUCKET = os.environ.get("GCP_GCS_BUCKET")
SCRAPE_BUCKET = os.environ.get("GCP_GCS_SCRAPE_BUCKET")

client = secretmanager.SecretManagerServiceClient()
project_id = os.environ.get('GOOGLE_CLOUD_PROJECT')
# reddit credentials
secret_name_reddit_credentials = f"projects/{project_id}/secrets/reddit_credentials/versions/latest"
response_rc = client.access_secret_version(name=secret_name_reddit_credentials)
reddit_credentials = response_rc.payload.data.decode("UTF-8")
reddit_credential_dict = json.loads(reddit_credentials)
# mongo connection
secret_name_mongodb_conn = "projects/soureddit/secrets/mongo_connection_string/versions/latest"
response_mongodb = client.access_secret_version(name=secret_name_mongodb_conn)
mongodb_connection_string = response_mongodb.payload.data.decode("UTF-8")


# MACROS
execution_date_time = '{{ ts_nodash }}'


# repo_url = os.environ['REPO_URL']
# repo_dir = '/tmp/repo'
#
# # Check if the repository has already been cloned
# if not os.path.exists(repo_dir):
#     # Clone the repository if it hasn't been cloned
#     repo = git.Repo.clone_from(repo_url, repo_dir)
# else:
#     # Pull the latest changes from the repository if it has been cloned
#     repo = git.Repo(repo_dir)
#     repo.remotes.origin.pull()
#
# sys.path.append(repo_dir)

def retrieve_subreddits() -> []:
    client = MongoClient(mongodb_connection_string)

    db = client.sour
    collection = db.soureddits

    subreddits = list(collection.find())

    client.close()

    subreddit_list = [subreddit['name'] for subreddit in subreddits]

    return subreddit_list


def scrape_and_ingest(bucket, object_name):
    from plugins import scraper

    subreddits = retrieve_subreddits()

    scrape_obj = scraper.Scrape(subreddits=subreddits,
                                reddit_credentials=reddit_credential_dict)
    df = scrape_obj.perform_scrape()

    logging.info(f'Returned df: {type(df)}')

    if df is None:
        logging.info('df is empty...')
        return False

    client = storage.Client()
    bucket = client.bucket(bucket)

    blob = bucket.blob(object_name)
    blob.upload_from_filename(df)


default_args = {
    "owner": "summarizer-hamdi",
    "start_date": days_ago(1),
    "depends_on_past": False,
    "retries": 1,
}

# NOTE: DAG declaration - using a Context Manager (an implicit way)
with DAG(
        dag_id="data_ingestion_gcs_dag",
        schedule_interval="@hourly",
        default_args=default_args,
        catchup=False,
        max_active_runs=1,
        tags=['scrape'],
) as dag:
    scrape_data_task = PythonOperator(
        task_id="scrape_data_task",
        python_callable=scrape_and_ingest,
        op_kwargs={
            "bucket": BUCKET,
            "object_name": f"raw/{execution_date_time}",
        },
    )

    scrape_data_task
