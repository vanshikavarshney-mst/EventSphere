const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const authenticateUser = require("../middleware/authMiddleware");
const { createBookingRules, validate } = require("../validators/bookingValidator");

// All booking routes require a logged-in user
router.post("/", authenticateUser, createBookingRules, validate, bookingController.createBooking);
router.get("/my", authenticateUser, bookingController.getMyBookings);
router.delete("/:id", authenticateUser, bookingController.cancelBooking);

module.exports = router;
