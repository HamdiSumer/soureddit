    const mongoose = require('mongoose');

    const popularSubredditSchema = new mongoose.Schema({
        subreddit: String,
        count: String,
    }, { collection: 'subreddits_to_scrape' });

    module.exports = mongoose.model('popularSubreddits', popularSubredditSchema);
