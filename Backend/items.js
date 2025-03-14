const mongoose = require('mongoose');

// Define Item schema and model
const itemSchema = new mongoose.Schema({
  "PersonName": String,
  "ItemName": String,
  "Category": String,
  "Condition": String,
  "Description": String,
  "Image": String
}, {
  collection: "items" 
});

module.exports = mongoose.model('Item', itemSchema);
