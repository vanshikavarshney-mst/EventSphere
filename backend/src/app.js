const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

/**
 * app.js
 * --------------------------------------------------
 * Configures the Express application: middleware, routes,
 * and error handlers. Does NOT start the server or connect
 * to the DB - that happens in server.js. Keeping them separate
 * makes the app easier to test later.
 */
const app = express();

// ---- Global Middleware ----
app.use(cors()); // allow frontend (different origin) to call this API
app.use(express.json()); // parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ---- Health check ----
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EventSphere API is running",
  });
});

// ---- API Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// ---- Error Handling (must be registered LAST) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
