import pandas as pd
import requests

API_URL = "https://api-inference.huggingface.co/models/tuner007/pegasus_summarizer"
API_TOKEN = "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"

headers = {"Authorization": f"Bearer {API_TOKEN}"}

data = {
        'a': [1, 2],
        'comments': ["deneme yapıyorum", "deneme yaptım"]
    }

df_sum = pd.DataFrame(data)





def summarize(row, state):
    payload = {"inputs": row['comments']}

    response = requests.post(API_URL, headers=headers, json=payload)

    state['processed_row_count'] += 1
    print(f"{state['processed_row_count']}/{state['total_rows']} rows has been processed | summarized.")
    return response.json()[0]['summary_text']

total_rows = df_sum.shape[0]
state = {'processed_row_count': 0, 'total_rows': total_rows}
df_sum['comments'] = df_sum.apply(summarize, args=(state,), axis=1)



