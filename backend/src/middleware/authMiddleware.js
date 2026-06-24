const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

/**
 * authMiddleware.js
 * --------------------------------------------------
 * Protects routes by checking for a valid JWT in the
 * "Authorization: Bearer <token>" header.
 * If valid, attaches the logged-in user to req.user
 * so controllers/services know who is making the request.
 */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token signature & expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make sure the user still exists in the database
    const userId = decoded.id || decoded.userId || decoded._id;

    const user = await userRepository.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user no longer exists",
      });
    }

    req.user = user; // attach full user document to the request
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid or expired token",
    });
  }
};

module.exports = authenticateUser;
