from scrapy.http import Request
from scrapy.exceptions import CloseSpider

from datetime import datetime

from . import GenericSozlukSpider
from ..items import Entry


class EksisozlukBaslikSpider(GenericSozlukSpider):
    name = 'eksisozluk'

    def __init__(self, **kwargs):
        super(EksisozlukBaslikSpider, self).__init__(**kwargs)

        self.allowed_domains = ['eksisozluk1923.com']

    def parse(self, response):

        items_to_scrape = response.xpath('//*[@id="topic"]/ul[@id="entry-list"]/li')
        if len(items_to_scrape) == 0:
            raise CloseSpider('no_item_found')

        for sel in items_to_scrape:
            entry_id = sel.xpath('./@data-id').extract()[0]
            title_id = response.xpath('//*[@id="title"]/a/@href').re(r'--(\d*)')[0]
            title = response.xpath('//*[@id="title"]/a/span/text()').extract()[0]
            date = sel.xpath('./footer/div[@class="info"]/a[@class="entry-date permalink"]/text()').re(r'\d{2}[.]\d{2}[.]\d{4} \d{2}[:]\d{2}')[0]
            text = sel.xpath('string(./div)').extract()[0]
            nick = sel.xpath('./footer/div[@class="info"]/a[@class="entry-author"]/text()').extract()[0]

            item = Entry()
            item['source'] = self.name
            item['title'] = title
            item['entry_id'] = entry_id
            item['title_id'] = title_id
            item['datetime'] = datetime.strptime(date, '%d.%m.%Y %H:%M')
            item['text'] = text
            item['nick'] = nick

            yield item

        current_page = int(response.xpath('//*[@id="topic"]/div[2]/@data-currentpage').extract()[0])
        page_count = int(response.xpath('//*[@id="topic"]/div[2]/@data-pagecount').extract()[0])

        current_url = response.request.url.split('?p')[0]

        next_page = current_page + 1
        if page_count >= next_page:
            yield Request('%s?p=%s' % (current_url, next_page))
