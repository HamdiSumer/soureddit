from scrapy.exceptions import DropItem
from .models import Entry, Seen
from datetime import datetime


class DatabasePipeline(object):

    @staticmethod
    def process_entry(item, spider):
        girdi_id = item.get('entry_id')  # Replace with the actual field name in your item

        if Seen.objects.filter(fingerprint=girdi_id).exists():
            raise DropItem("Duplicate item found: %s" % girdi_id)

        entry = Entry(**item, insert_date=datetime.now())
        entry.save()

        return item
