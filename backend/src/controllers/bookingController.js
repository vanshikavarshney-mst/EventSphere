const bookingService = require("../services/bookingService");

/**
 * bookingController.js
 * --------------------------------------------------
 * Handles all HTTP requests related to bookings.
 */

// POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { eventId, seats } = req.body;

    const booking = await bookingService.createBooking(
      req.user._id,
      eventId,
      seats,
      req.user.email
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getMyBookings(req.user._id);

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/bookings/:id
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.user._id,
      req.user.email
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
