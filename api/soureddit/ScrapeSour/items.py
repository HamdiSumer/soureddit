import scrapy


class Entry(scrapy.Item):
    source = scrapy.Field()
    entry_id = scrapy.Field()
    title_id = scrapy.Field()
    title = scrapy.Field()
    content = scrapy.Field()
    create_date = scrapy.Field()
    author = scrapy.Field()
