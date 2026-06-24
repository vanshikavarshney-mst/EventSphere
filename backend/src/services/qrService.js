const QRCode = require("qrcode");

/**
 * qrService.js
 * --------------------------------------------------
 * Generates a QR code for a confirmed booking.
 * The QR payload contains just enough info to identify the booking
 * (bookingId, userId, eventId) so it can be scanned/verified at the
 * event entrance later.
 *
 * Returns a base64 data-URL string (e.g. "data:image/png;base64,....")
 * which can be stored directly in the Booking document and
 * rendered as an <img src="..."> on the frontend or in an email.
 */
const generateBookingQR = async ({ bookingId, userId, eventId }) => {
  const payload = JSON.stringify({ bookingId, userId, eventId });

  try {
    const qrImage = await QRCode.toDataURL(payload);
    return qrImage;
  } catch (error) {
    console.error("QR generation failed:", error.message);
    throw new Error("Failed to generate QR code");
  }
};

module.exports = {
  generateBookingQR,
};
