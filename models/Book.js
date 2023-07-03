const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  writer: {
    type: String,
    required: true
  },
  audience: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;