from django.db import models

class SubredditsToScrape(models.Model):
    id = models.AutoField(primary_key=True)
    subreddit = models.CharField(max_length=255)
    count = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'subreddits_to_scrape'  # Specify the MongoDB collection name

    def str(self):
        return f"Subreddit: {self.subreddit}, Count: {self.count}"

class Subreddits(models.Model):
    id = models.AutoField(primary_key=True)
    subreddit = models.CharField(max_length=255)
    count = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'subreddits'  # Specify the MongoDB collection name

    def __str__(self):
        return f"Subreddit: {self.subreddit}, Count: {self.count}"
