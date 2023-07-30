# -*- coding: utf-8 -*-

from scrapy import Spider
from scrapy.http import Request
from scrapy.exceptions import CloseSpider
from ..models import Seen
from scrapy.utils.request import request_fingerprint


class GenericSozlukSpider(Spider):
    def __init__(self, **kwargs):
        super(GenericSozlukSpider, self).__init__(**kwargs)

        if 'title' not in kwargs:
            raise CloseSpider('Title should be given to scrape')

        self.urls = kwargs['title'].split(',')
        self.allowed_domains = []

    @staticmethod
    def is_request_seen(self, request):
        fingerprint = request_fingerprint(request)

        # Check if the fingerprint exists in the 'Seen' model's Cassandra table
        return Seen.objects.filter(fingerprint=fingerprint).exists()

    def start_requests(self):
        self.log('Eliminating already seen web pages. If you think crawler is not working '
                 'please check "seen" table in the database')

        return [Request(i) for i in self.urls if not self.is_request_seen(Request(i))]

    def parse(self, response):
        raise NotImplementedError
