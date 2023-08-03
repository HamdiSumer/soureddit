// post-routes.js

const express = require('express');
const router = express.Router();
const postController=require('../controllers/post-controller')


// Middleware function for '/api/posts' route
router.get('/:pid',postController.getPostById);
module.exports = router;
