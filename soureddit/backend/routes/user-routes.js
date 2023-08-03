const express = require('express');
const { check } = require('express-validator'); // Make sure this line is correct

const usersController = require('../controllers/user-controller');

const router = express.Router();

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

module.exports = router;
