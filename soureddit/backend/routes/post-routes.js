// post-routes.js

const express = require('express');
const router = express.Router();

//! delete the dummies after connect
const DUMMY_POSTS=[
    {
        id:'p1',
        title:'BLABALVBAL',
        description:'bla blla bla means empthy'
    }
]

// Middleware function for '/api/posts' route
router.get('/:pid', (req, res, next) => {
    const postId = req.params.pid;
    const post = DUMMY_POSTS.find(p=>{
        return p.id === postId;
    });
  // Your route handling logic goes here
  res.json({post}); // => { place } => {place : place}
});

module.exports = router;
