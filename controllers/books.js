const Book = require('../models/Book');

// Get all books
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    next(error);
  }
};

// Get a book by ID
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    next(error);
  }
};

// Create a new book
exports.createBook = async (req, res, next) => {
  try {
    const { title, author, year, genre, writer, audience, pages } = req.body;
    const book = new Book({ title, author, year, genre, writer, audience, pages });
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    next(error);
  }
};

// Update a book by ID
exports.updateBook = async (req, res, next) => {
  try {
    const { title, author, year, genre, writer, audience, pages } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, year, genre, writer, audience, pages },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
};

// Delete a book by ID
exports.deleteBook = async (req, res, next) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};