const Booking = require("../models/Booking");

/**
 * bookingRepository.js
 * --------------------------------------------------
 * All direct database operations for the Booking collection.
 */

const createBooking = async (bookingData) => {
  return await Booking.create(bookingData);
};

// Get all bookings for one user, with event & user details populated
const findBookings = async (filter = {}) => {
  return await Booking.find(filter)
    .populate("userId", "name email")
    .populate("eventId", "title venue date image status");
};

const findBookingById = async (id) => {
  return await Booking.findById(id)
    .populate("userId", "name email")
    .populate("eventId", "title venue date image status");
};

const cancelBooking = async (id) => {
  return await Booking.findByIdAndUpdate(
    id,
    { bookingStatus: "Cancelled" },
    { new: true }
  );
};

const countBookings = async (filter = {}) => {
  return await Booking.countDocuments(filter);
};

module.exports = {
  createBooking,
  findBookings,
  findBookingById,
  cancelBooking,
  countBookings,
};
