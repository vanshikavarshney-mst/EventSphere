const mongoose = require("mongoose");

/**
 * Seat Sub-Schema.
 * Seats are stored INSIDE the Event document (embedded sub-documents)
 * because seats always belong to exactly one event and are always
 * read/updated together with that event. This avoids an unnecessary
 * extra collection and extra joins for a simple training project.
 */
const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true, // e.g. "F1", "M12", "B30"
  },
  category: {
    type: String,
    enum: ["Front", "Middle", "Back"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Reserved"],
    default: "Available",
  },
  price: {
    type: Number,
    default: 0,
  },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
    },

    venue: {
      type: String,
      required: [true, "Venue is required"],
    },

    date: {
      type: Date,
      required: [true, "Event date is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"], // e.g. Workshop, Concert, Conference
    },

    image: {
  type: String,
  default: "",
},

    status: {
      type: String,
      enum: ["Upcoming", "Live", "Completed", "Cancelled"],
      default: "Upcoming",
    },

    // Price per seat. Used only for simple revenue analytics
    // on the admin dashboard (no real payment gateway involved).
    price: {
      type: Number,
      default: 0,
    },

    seats: [seatSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
