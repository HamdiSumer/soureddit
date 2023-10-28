const popularSubreddits = require('../models/popularSubreddits'); // Specify the model name

// Controller function to retrieve all subreddits from the collection
const getAllSubreddits = async (req, res) => {
    try {
        const subreddits = await popularSubreddits.find({}, 'count subreddit'); // Retrieve only 'count' and 'subreddit' fields
        res.json(subreddits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllSubreddits,
};
