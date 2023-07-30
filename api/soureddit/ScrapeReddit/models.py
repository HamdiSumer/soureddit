from django.db import models


class Subreddits(models.Model):
    name = models.CharField(max_length=100, unique=True)
    count = models.IntegerField(default=0)

    def __str__(self):
        return self.name
