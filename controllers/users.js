const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get a user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday, favoriteGenre, favoriteAuthor } = req.body;
    const user = new User({ firstName, lastName, email, favoriteColor, birthday, favoriteGenre, favoriteAuthor });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

// Update a user by ID
exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday, favoriteGenre, favoriteAuthor } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, favoriteColor, birthday, favoriteGenre, favoriteAuthor },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};