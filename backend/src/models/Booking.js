const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    seats: [
      {
        type: String, // seat numbers booked, e.g. ["F1", "F2"]
        required: true,
      },
    ],

    bookingStatus: {
      type: String,
      enum: ["Confirmed", "Cancelled"],
      default: "Confirmed",
    },

    qrCode: {
      type: String, // base64 QR code image string
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
