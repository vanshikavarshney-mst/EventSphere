const nodemailer = require("nodemailer");

/**
 * emailService.js
 * --------------------------------------------------
 * Sends transactional emails (booking confirmation & cancellation)
 * using Nodemailer with SMTP credentials from environment variables.
 */

// Creates a reusable transporter using the SMTP details from .env
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for other ports like 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Sends the booking confirmation email.
 * Contains: Event Name, Venue, Date, Seats, QR Code.
 */
const sendBookingConfirmationEmail = async ({
  to,
  eventName,
  venue,
  date,
  seats,
  qrCode,
}) => {
  const transporter = createTransporter();

  const html = `
    <h2>Booking Confirmed 🎉</h2>
    <p>Your seats have been successfully booked for the following event:</p>
    <ul>
      <li><b>Event:</b> ${eventName}</li>
      <li><b>Venue:</b> ${venue}</li>
      <li><b>Date:</b> ${new Date(date).toDateString()}</li>
      <li><b>Seats:</b> ${seats.join(", ")}</li>
    </ul>
    <p>Show the QR code below at the entrance:</p>
    <img src="${qrCode}" alt="Booking QR Code" />
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "EventSphere - Booking Confirmation",
    html,
  });
};

/**
 * Sends the booking cancellation email.
 * Contains: Booking Cancelled, Seats Released.
 */
const sendBookingCancellationEmail = async ({ to, eventName, seats }) => {
  const transporter = createTransporter();

  const html = `
    <h2>Booking Cancelled</h2>
    <p>Your booking for <b>${eventName}</b> has been cancelled.</p>
    <p>The following seats have been released and are now available for others to book:</p>
    <p>${seats.join(", ")}</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "EventSphere - Booking Cancelled",
    html,
  });
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
};
