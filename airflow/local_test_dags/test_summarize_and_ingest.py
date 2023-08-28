import openai
import pandas as pd

df = pd.read_parquet("raw_20230827T222023")



# Summarize comments using Spark
openai.api_key = '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'


def summarize(row):
    response = openai.Completion.create(
        engine="davinci",  # Use "davinci" for general use, "davinci-codex" for code-related tasks
        prompt=row['comments'],
        max_tokens=150  # Adjust the desired length of the summary
    )

    summary = response.choices[0].text.strip()

    return summary

df['comments'] = df.apply(summarize, axis=1)

input_text = "DENEME YAPIYORUM"

summary = response.choices[0].text.strip()

# Stop Spark session
spark.stop()
