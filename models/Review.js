const mongoose = require('mongoose');

// Create a schema
var schema = mongoose.Schema({
  author: String,
  subject: String,
  rating: Number,
  content: String,
  date: String
})

module.exports = mongoose.model("Review", schema);