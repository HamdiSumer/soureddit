const postController=require('../controllers/post-controller')
const express = require('express');
const router = express.Router();
// Middleware function for '/api/posts' route
router.get('/', postController.getPosts);

router.get('/:subreddit',postController.getPostsBySubreddit)


module.exports = router;
