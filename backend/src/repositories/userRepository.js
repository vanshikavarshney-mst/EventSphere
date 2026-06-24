const User = require("../models/User");

/**
 * userRepository.js
 * --------------------------------------------------
 * The repository layer talks directly to the database (via Mongoose).
 * Services call these functions instead of using the User model directly.
 * This keeps DB queries in one place, so if we ever change the
 * database or ORM, only this file needs to change.
 */

// Create a new user document
const createUser = async (userData) => {
  return await User.create(userData);
};

// Find a user by email. Includes password because login needs to compare it.
const findByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};

// Find a user by their Mongo _id (password excluded by default schema option)
const findById = async (id) => {
  return await User.findById(id);
};

module.exports = {
  createUser,
  findByEmail,
  findById,
};
