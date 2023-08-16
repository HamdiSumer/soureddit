const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/user-controller');
const Subreddit = require('../models/subreddits');

const router = express.Router();

router.get('/subreddits', async (req, res, next) => {
  try {
    const subreddits = await Subreddit.find();
    res.json(subreddits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching subreddits' });
  }
});

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  [
    check('username').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post('/login', usersController.login);

// New route to fetch user by userId
router.get('/:userId', usersController.getUserById);

// New route to fetch user by email
router.get('/email/:email', usersController.getUserByEmail); // Add this line to create the route

router.put('/:userId/selectedItems', usersController.updateUserSelectedItems);


module.exports = router;