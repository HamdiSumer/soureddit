from scrapy.dupefilters import BaseDupeFilter
from scrapy.utils.request import request_fingerprint
from .models import Seen
from datetime import datetime


class CassandraDupeFilter(BaseDupeFilter):
    def request_seen(self, request):
        fingerprint = request_fingerprint(request)

        # Check if the fingerprint exists in the Cassandra database
        is_seen = Seen.objects.filter(fingerprint=fingerprint).exists()

        if not is_seen:
            # If not seen, add the URL to the database as seen
            Seen.create(
                fingerprint=fingerprint,
                url=request.url,
                last_crawl_time=datetime.now()
            )

        return is_seen
