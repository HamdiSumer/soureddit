#!/usr/bin/env bash

PASS=$(openssl rand -base64 12)

until printf "" 2>>/dev/null >>/dev/tcp/cassandra/9042; do
    sleep 5;
    echo "Waiting for cassandra...";
done

echo "Creating user..."
cqlsh cassandra -u cassandra -p cassandra -e "CREATE USER ${CASSANDRA_USER} WITH PASSWORD '${CASSANDRA_PASSWORD}' SUPERUSER;"


echo "Creating keyspace..."
cqlsh cassandra -u cassandra -p cassandra -e "CREATE KEYSPACE IF NOT EXISTS ${KEYSPACE} WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
echo "Creating reddit_posts table..."
cqlsh cassandra -u cassandra -p cassandra -e "CREATE TABLE IF NOT EXISTS ${KEYSPACE}.${TABLE_NAME} (id uuid PRIMARY KEY, insert_timestamp timestamp, post_timestamp timestamp, scrape_timestamp timestamp, subreddit text, subscriber_count int, title text, author text, score int, post_type text, body blob, comments blob, url text);"
echo "Finished creating user, keyspace and tier tables"

echo "Creating indexes for efficient filtering..."
cqlsh cassandra -u cassandra -p cassandra -e "CREATE INDEX IF NOT EXISTS subreddit_index ON ${KEYSPACE}.${TABLE_NAME} (subreddit);"

echo "Randomizing root user password..."
cqlsh cassandra -u cassandra -p cassandra -e "ALTER USER cassandra WITH PASSWORD '${PASS}';"
echo "Changed default user password"

echo "Finished Initialization"