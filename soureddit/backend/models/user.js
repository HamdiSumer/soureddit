const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  selectedItems: [String], // Store the selected items directly within the user document
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
