


# class Entry(DjangoCassandraModel):
#     id = columns.UUID(primary_key=True, default=uuid.uuid4)
#     entry_id = columns.BigInt()
#     title_id = columns.BigInt()
#     source = columns.Text(max_length=100)
#     title = columns.Text(max_length=100)
#     author = columns.Text(max_length=100)
#     content = columns.Text()  # Cassandra does not have specific CLOB type
#     create_date = columns.DateTime()
#     insert_date = columns.DateTime()
#
#     def __str__(self):
#         return f'{self.id}'
#
#
# class Seen(DjangoCassandraModel):
#     """
#         Prevent Duplicate Database Entries
#     """
#     id = columns.UUID(primary_key=True, default=uuid.uuid4)
#     fingerprint = columns.Text(max_length=40)
#     url = columns.Text(max_length=300)
#     last_crawl_time = columns.DateTime()


