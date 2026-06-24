const bookingRepository = require("../repositories/bookingRepository");
const eventRepository = require("../repositories/eventRepository");
const qrService = require("./qrService");
const emailService = require("./emailService");

/**
 * bookingService.js
 * --------------------------------------------------
 * Implements the full booking flow described in the project spec:
 *
 *   Select Seats -> Validate Seats -> Check Availability ->
 *   Create Booking -> Reserve Seats -> Generate QR -> Send Email -> Success
 */

/**
 * Creates a new booking for a user.
 * @param {String} userId   - logged-in user's id
 * @param {String} eventId  - event being booked
 * @param {String[]} seatNumbers - e.g. ["F1", "F2"]
 * @param {String} userEmail - used to send the confirmation email
 */
const createBooking = async (userId, eventId, seatNumbers, userEmail) => {
  if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    const error = new Error("Please select at least one seat");
    error.statusCode = 400;
    throw error;
  }

  // 1. Fetch the event (this also gives us its current seat map)
  const event = await eventRepository.findEvent(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Validate that every requested seat number actually exists on this event
  const seatDocs = seatNumbers.map((seatNum) => {
    const seat = event.seats.find((s) => s.seatNumber === seatNum);

    if (!seat) {
      const error = new Error(`Seat ${seatNum} does not exist on this event`);
      error.statusCode = 400;
      throw error;
    }

    return seat;
  });

  // 3. Check availability - if ANY seat is already reserved, reject the whole booking
  const alreadyBookedSeat = seatDocs.find((seat) => seat.status === "Reserved");

  if (alreadyBookedSeat) {
    const error = new Error(
      `Seat already booked: ${alreadyBookedSeat.seatNumber}`
    );
    error.statusCode = 409; // Conflict
    throw error;
  }

  // 4. All seats are available -> mark them as Reserved
  seatDocs.forEach((seat) => {
    seat.status = "Reserved";
  });
  await eventRepository.saveEvent(event);

  // 5. Create the booking record
  let booking = await bookingRepository.createBooking({
    userId,
    eventId,
    seats: seatNumbers,
    bookingStatus: "Confirmed",
    bookingDate: new Date(),
  });

  // 6. Generate QR code for this booking
  const qrCode = await qrService.generateBookingQR({
    bookingId: booking._id,
    userId,
    eventId,
  });

  booking.qrCode = qrCode;
  await booking.save();

  // 7. Send confirmation email (does not block booking success if email fails)
  try {
    await emailService.sendBookingConfirmationEmail({
      to: userEmail,
      eventName: event.title,
      venue: event.venue,
      date: event.date,
      seats: seatNumbers,
      qrCode,
    });
  } catch (emailError) {
    console.error("Failed to send confirmation email:", emailError.message);
  }

  // 8. Return the fully populated booking
  const populatedBooking = await bookingRepository.findBookingById(booking._id);
  return populatedBooking;
};

// Get all bookings belonging to the logged-in user
const getMyBookings = async (userId) => {
  return await bookingRepository.findBookings({ userId });
};

/**
 * Cancels a booking:
 *   Cancel Booking -> Update Booking Status -> Release Seats -> Send Email
 */
const cancelBooking = async (bookingId, userId, userEmail) => {
  const booking = await bookingRepository.findBookingById(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  // Make sure users can only cancel their own bookings
  if (booking.userId._id.toString() !== userId.toString()) {
    const error = new Error("You are not allowed to cancel this booking");
    error.statusCode = 403;
    throw error;
  }

  if (booking.bookingStatus === "Cancelled") {
    const error = new Error("Booking is already cancelled");
    error.statusCode = 400;
    throw error;
  }

  // 1. Update booking status
  const updatedBooking = await bookingRepository.cancelBooking(bookingId);

  // 2. Release the seats back to "Available" on the event
  const event = await eventRepository.findEvent(booking.eventId._id);

  if (event) {
    event.seats.forEach((seat) => {
      if (booking.seats.includes(seat.seatNumber)) {
        seat.status = "Available";
      }
    });
    await eventRepository.saveEvent(event);
  }

  // 3. Send cancellation email
  try {
    await emailService.sendBookingCancellationEmail({
      to: userEmail,
      eventName: booking.eventId.title,
      seats: booking.seats,
    });
  } catch (emailError) {
    console.error("Failed to send cancellation email:", emailError.message);
  }

  return updatedBooking;
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
