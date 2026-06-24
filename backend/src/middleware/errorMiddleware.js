/**
 * errorMiddleware.js
 * --------------------------------------------------
 * Centralized error handler. Instead of writing
 * res.status(...).json(...) in every controller's catch block,
 * controllers simply call next(error) and this middleware
 * formats the final response consistently.
 *
 * Must be registered LAST in app.js (after all routes).
 */

// Handles requests to routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Final error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId (e.g. invalid id passed in URL params)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
