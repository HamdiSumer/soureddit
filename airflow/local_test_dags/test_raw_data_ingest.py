from pymongo import MongoClient
from minio import Minio
from minio.error import S3Error
from kafka import KafkaProducer


client_id = "w2tL4mslrTK91M98Kn-geg"
client_secret = "ga7EDpuBGLhBqqOM8WKdbzTq_VFmoQ"
user_agent = "subreddit-scrape by /MaeleriS"

mongodb_uri = "mongodb+srv://ozetEksiKirmizi:VZwmcxxZ2AmIWIJz@mongosour.iig2uoq.mongodb.net/?retryWrites=true&w=majority"

BUCKET = "raw"

minio_endpoint = "minio:9000"

minio_access_key = "minio"
minio_secret_key = "miniosoureddit"

mongo_db = "soureddit"
mongo_collection = "subreddits"

reddit_credential_dict = {"client_id": client_id,
                          "client_secret": client_secret,
                          "user_agent": user_agent}

# MACROS
execution_date_time = "{{ ts_nodash }}"

# KAFKA
kafka_bootstrap_servers = 'localhost'
kafka_topic = 'objects_to_process'



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
        # kafka buraya gelirse message göndermesin çünkü df scraped yok !
        return False

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

    except S3Error as err:
        return False


    send_to_kafka()

def send_to_kafka(object_name):
    kafka_producer = KafkaProducer(bootstrap_servers=kafka_bootstrap_servers,
                                   api_version=(0, 10, 2))

    kafka_producer.send(kafka_topic, key=object_name.encode(), value=object_name.encode())
    kafka_producer.flush()


if __name__ == "__main__":
    # scrape_and_ingest(bucket=BUCKET, object_name='test')
    send_to_kafka(object_name='test')
