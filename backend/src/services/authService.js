const userRepository = require("../repositories/userRepository");
const generateToken = require("../utils/generateToken");

/**
 * authService.js
 * --------------------------------------------------
 * Contains the actual BUSINESS LOGIC for authentication.
 * Controllers stay thin and just call these functions.
 */

// Register a new user
const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    const error = new Error("User already exists with this email");
    error.statusCode = 400;
    throw error;
  }

  // Password is hashed automatically by the User model's pre-save hook
  const user = await userRepository.createUser({ name, email, password, role });

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// Login an existing user
const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// Get the logged-in user's own profile (used by GET /api/auth/me)
const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
