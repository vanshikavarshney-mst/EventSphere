const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const bookingController = require("../controllers/bookingController");

// USER DASHBOARD (only their bookings)
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("user", "admin"),
  bookingController.getMyBookings
);

// USER BOOK EVENT
router.post(
  "/book/:eventId",
  authenticateUser,
  authorizeRoles("user"),
  bookingController.createBooking
);

module.exports = router;