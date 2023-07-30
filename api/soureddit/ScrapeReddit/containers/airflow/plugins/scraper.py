import praw
import pandas as pd

from datetime import datetime


class Scrape:
    _TOTAL_SECONDS_IN_A_HOUR = 3600

    def __init__(self, subreddits: list, reddit_credentials: {}):
        self.instance = self.create_reddit_instance()
        self.df = self.create_data_frame()
        self.stop_scrape = False
        self.subreddits = subreddits
        self.reddit_credentials = reddit_credentials

    def create_reddit_instance(self):
        return praw.Reddit(client_id=self.reddit_credentials['client_id'],
                           client_secret=self.reddit_credentials['client_secret'],
                           user_agent=self.reddit_credentials['user_agent'])

    def scraper(self, subreddit) -> None:

        posts = subreddit.new(limit=None)

        for post in posts:
            post_time_stamp = post.created
            # convert both times into utc and take the time difference.
            time_difference = (datetime.utcnow() - datetime.utcfromtimestamp(post_time_stamp)).total_seconds()
            comment_paragraph = ""
            result = {}

            # if it has been >= 1 hours stop scraping
            if time_difference >= self._TOTAL_SECONDS_IN_A_HOUR:
                break

            # Retrieving comments
            post.comments.replace_more(limit=None)
            for comment in post.comments.list():
                comment_paragraph += comment.body

            result['time_stamp'] = datetime.fromtimestamp(post_time_stamp)
            result['subreddit'] = subreddit.display_name
            result['subscriber_count'] = subreddit.subscribers
            result['title'] = post.title
            result['author'] = post.author.name
            result['score'] = post.score
            result['post_type'] = post.link_flair_text
            result['comments'] = comment_paragraph

            self.append_to_df(result)

    @staticmethod
    def create_data_frame():
        df = pd.DataFrame({'time_stamp': pd.Series(dtype='str'),
                           'subreddit': pd.Series(dtype='str'),
                           'subscriber_count': pd.Series(dtype='int'),
                           'title': pd.Series(dtype='str'),
                           'author': pd.Series(dtype='str'),
                           'score': pd.Series(dtype='int'),
                           'post_type': pd.Series(dtype='str'),
                           'comments': pd.Series(dtype='str')})

        return df

    def append_to_df(self, result) -> None:
        df_dictionary = pd.DataFrame([result])
        self.df = pd.concat([self.df, df_dictionary], ignore_index=True)

    def perform_scrape(self) -> pd.DataFrame:
        for subreddit in self.subreddits:
            # Get the subreddit object
            sub = self.instance.subreddit(subreddit)
            if sub.over18:
                continue
            self.scraper(sub)

        # return the data as parquet
        if len(self.df.head(1)) == 0:
            return None

        df_parquet = self.df.to_parquet()
        return df_parquet


if __name__ == "__main__":
    scrape = Scrape(subreddits=["YouShouldKnow",
                                "explainlikeimfive"])
    scrape.perform_scrape()

