const HttpError = require('../models/http-error');
const Post = require('../models/posts');
const { post } = require('../routes/post-routes');

const getPostById = async (req, res, next) => {
  const postId = req.params.pid;
  let post;
  try {
    post = await Post.findById(postId).exec();
  } catch (err) {
    const error = new HttpError('Something went wrong', 500);
    return next(error);
  }

  if (!post) {
    const error = new HttpError('Could not find the provided post id. ', 404);
    return next(error);
  }

  res.json({ post: post.toObject({ getters: true }) });
};

exports.getPostById = getPostById;
