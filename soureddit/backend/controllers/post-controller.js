const HttpError = require('../models/http-error');
const Post = require('../models/posts');
const { post } = require('../routes/post-routes');

// Function to get all posts
const getPosts = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find(); // Fetch all posts from the MongoDB Atlas database
  } catch (err) {
    const error = new HttpError('Something went wrong', 500);
    return next(error);
  }

  if (!posts || posts.length === 0) {
    const error = new HttpError('No posts found.', 404);
    return next(error);
  }

  res.json({ posts });
};

const getPostsBySubreddit = async (req, res, next) => {
  const subreddit = req.params.subreddit; // Get the subreddit from the URL parameter
  let posts;
  try {
    posts = await Post.find({ subreddit }); // Fetch posts by the specified subreddit
  } catch (err) {
    const error = new HttpError('Something went wrong', 500);
    return next(error);
  }

  if (!posts || posts.length === 0) {
    const error = new HttpError('Could not find any posts for the provided subreddit.', 404);
    return next(error);
  }

  res.json({ posts });
};

exports.getPostsBySubreddit = getPostsBySubreddit;
exports.getPosts = getPosts;
