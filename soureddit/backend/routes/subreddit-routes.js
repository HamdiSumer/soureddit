const express = require('express');
const router = express.Router();
const subredditController = require('../controllers/subreddit-controller'); // Adjust the path as needed

// Define a route to retrieve subreddits
router.get('/', subredditController.getAllSubreddits);

module.exports = router;
