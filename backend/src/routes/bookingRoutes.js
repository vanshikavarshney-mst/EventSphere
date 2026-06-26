const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { createBookingRules, validate } = require("../validators/bookingValidator");

// Only regular users can create or manage bookings.
router.post("/", authenticateUser, authorizeRoles("user"), createBookingRules, validate, bookingController.createBooking);
router.get("/my", authenticateUser, authorizeRoles("user"), bookingController.getMyBookings);
router.delete("/:id", authenticateUser, authorizeRoles("user"), bookingController.cancelBooking);

module.exports = router;
