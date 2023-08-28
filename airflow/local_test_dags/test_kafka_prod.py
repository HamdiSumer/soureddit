import pandas as pd
from cassandra.cluster import Cluster



def save_to_cassandra(df: pd.DataFrame):
    cluster = Cluster(['localhost'])
    session = cluster.connect()

    keyspace = 'soureddit'
    table = 'test'

    columns = df.columns

    query = f"INSERT INTO {keyspace}.{table} (id, {','.join(map(str, columns))}) VALUES (uuid(), {','.join(map(str, '?'*len(columns)))})"
    prepared = session.prepare(query)

    # # Iterate through rows and insert data into Cassandra table
    for index, row in df.iterrows():
        session.execute(prepared, tuple(row.iloc[range(len(columns))]))

if __name__ == "__main__":

    data = {
        'a': [1, 2],
        'b': [3, 4]
    }

    df = pd.DataFrame(data)

    df["a"] = df["a"].astype(int)
    df["b"] = df["b"].astype(int)

    save_to_cassandra(df)





