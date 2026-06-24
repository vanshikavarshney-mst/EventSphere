const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for a logged-in user.
 * The payload only contains "id" and "role" (never the password)
 * so the token stays small and authMiddleware can quickly
 * identify who is making the request and what they're allowed to do.
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
