const mongoose = require('mongoose');

const selectedItemsSchema = new mongoose.Schema({
  items: [String], // An array to store the selected items
});

const SelectedItem = mongoose.model('SelectedItem', selectedItemsSchema);

module.exports = SelectedItem;