// post-routes.js

const express = require('express');
const router = express.Router();
const HttpError= require ('../models/http-error');
const postController=require('../controllers/post-controller')


// Middleware function for '/api/posts' route
router.get('/:pid',postController.getPostById);
module.exports = router;
