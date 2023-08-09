// models/subreddit.js
const mongoose = require('mongoose');

const subredditSchema = new mongoose.Schema({
  id: String,
  label: String,
});

module.exports = mongoose.model('Subreddit', subredditSchema);
