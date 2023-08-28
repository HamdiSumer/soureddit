const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { username, email, password, selectedItems } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('User exists already, please login instead.', 422);
    return next(error);
  }

  const createdUser = new User({
    username,
    email,
    password,
    selectedItems: selectedItems, // Store the selected items in the user document
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({ message: 'Logged in!' });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.userId;

  let user;
  try {
    user = await User.findById(userId, '-password');
  } catch (err) {
    return next(new HttpError('Could not fetch user.', 500));
  }

  if (!user) {
    return next(new HttpError('User not found.', 404));
  }

  res.json({ user: user.toObject({ getters: true }) });
};
// Add this function to users-controller.js
const getUserByEmail = async (req, res, next) => {
  const email = req.params.email;

  let user;
  try {
    user = await User.findOne({ email: email }, '-password');
  } catch (err) {
    return next(new HttpError('Could not fetch user.', 500));
  }

  if (!user) {
    return next(new HttpError('User not found.', 404));
  }

  res.json({ user: user.toObject({ getters: true }) });
};
const getUsersSelections = async (req, res, next) => {
  const userId = req.params.userId; // Use userId instead of email

  let user;
  try {
    user = await User.findById(userId, 'selectedItems'); // Fetch only the selectedItems field using findById
  } catch (err) {
    return next(new HttpError('Could not fetch user selections.', 500));
  }

  if (!user) {
    return next(new HttpError('User not found.', 404));
  }

  res.json({ selectedItems: user.selectedItems }); // Return the selectedItems field
};
const updateUserSelectedItems = async (req, res, next) => {
  const userId = req.params.userId;
  const { selectedItems } = req.body.user; // Access selectedItems from the user object in the request body

  try {
    // Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the selectedItems field for the user identified by userId in your database
    user.selectedItems = selectedItems; // Update the selectedItems field
    await user.save(); // Save the updated user document

    res.status(200).json({ message: 'Selected items updated successfully', user: user });
  } catch (error) {
    console.error('Error updating user selected items:', error);
    res.status(500).json({ message: 'Could not update selected items' });
  }
};
const updateChance = async (req, res, next) => {
  const userId = req.params.userId;
  const { updateChance } = req.body.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.updateChance = updateChance;
    await user.save();

    res.status(200).json({ message: 'updateChance updated successfully', user: user });
  } catch (error) {
    console.error('Error updateChance:', error);
    res.status(500).json({ message: 'Could not updateChance' });
  }
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail; // Add this line to export the getUserByEmail function
exports.getUsersSelections=getUsersSelections;
exports.updateUserSelectedItems = updateUserSelectedItems;
exports.updateChance = updateChance;