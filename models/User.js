const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  favoriteColor: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  favoriteGenre: {
    type: String,
    required: true
  },
  favoriteAuthor: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;