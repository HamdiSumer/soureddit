import requests
import pandas as pd

df = pd.read_parquet("raw_20230827T222023")

API_URL = "https://api-inference.huggingface.co/models/tuner007/pegasus_summarizer"
API_TOKEN = "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"
headers = {"Authorization": f"Bearer {API_TOKEN}"}


def summarize(row):
    payload = {"inputs": row['comments']}
    response = requests.post(API_URL, headers=headers, json=payload)
    if response.status_code == 200:
        # summarize success
        return response.json()[0]['summary_text']
    else:
        return None

df['comments'] = df.apply(summarize, axis=1)