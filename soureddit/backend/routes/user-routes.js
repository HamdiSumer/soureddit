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

router.get('/:userId', usersController.getUserById);

router.get('/email/:email', usersController.getUserByEmail);

router.put('/:userId/selectedItems', usersController.updateUserSelectedItems);

router.put('/:userId/updateChance', usersController.updateChance);


module.exports = router;