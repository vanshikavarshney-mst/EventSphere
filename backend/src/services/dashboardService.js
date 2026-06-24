const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

/**
 * dashboardService.js
 * --------------------------------------------------
 * Admin-only analytics. Uses MongoDB's Aggregation Pipeline
 * to calculate numbers directly in the database instead of
 * pulling all documents into Node and looping over them
 * (which would not scale well).
 */

// Basic counts + revenue + overall seat occupancy
const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalEvents = await Event.countDocuments();
  const totalBookings = await Booking.countDocuments({ bookingStatus: "Confirmed" });

  // Revenue = sum of (number of booked seats * that event's price)
  // for every CONFIRMED booking. We $lookup the event to get its price.
  const revenueResult = await Booking.aggregate([
    { $match: { bookingStatus: "Confirmed" } },
    {
      $lookup: {
        from: "events",
        localField: "eventId",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    {
      $project: {
        seatCount: { $size: "$seats" },
        price: "$event.price",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $multiply: ["$seatCount", "$price"] } },
      },
    },
  ]);

  const revenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  // Occupancy % = (total reserved seats across all events / total seats) * 100
  const occupancyResult = await Event.aggregate([
    { $unwind: "$seats" },
    {
      $group: {
        _id: null,
        totalSeats: { $sum: 1 },
        reservedSeats: {
          $sum: { $cond: [{ $eq: ["$seats.status", "Reserved"] }, 1, 0] },
        },
      },
    },
  ]);

  let occupancyPercentage = 0;
  if (occupancyResult.length > 0 && occupancyResult[0].totalSeats > 0) {
    occupancyPercentage =
      (occupancyResult[0].reservedSeats / occupancyResult[0].totalSeats) * 100;
  }

  return {
    totalUsers,
    totalEvents,
    totalBookings,
    revenue,
    occupancyPercentage: Number(occupancyPercentage.toFixed(2)),
  };
};

// Number of confirmed bookings per event (useful for a bar chart on the frontend)
const getBookingsPerEvent = async () => {
  return await Booking.aggregate([
    { $match: { bookingStatus: "Confirmed" } },
    {
      $group: {
        _id: "$eventId",
        totalBookings: { $sum: 1 },
        totalSeatsBooked: { $sum: { $size: "$seats" } },
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    {
      $project: {
        _id: 0,
        eventId: "$_id",
        eventTitle: "$event.title",
        totalBookings: 1,
        totalSeatsBooked: 1,
      },
    },
  ]);
};

// Seat occupancy grouped by seat category (Front / Middle / Back) across all events
const getCategoryOccupancy = async () => {
  return await Event.aggregate([
    { $unwind: "$seats" },
    {
      $group: {
        _id: "$seats.category",
        totalSeats: { $sum: 1 },
        reservedSeats: {
          $sum: { $cond: [{ $eq: ["$seats.status", "Reserved"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalSeats: 1,
        reservedSeats: 1,
        occupancyPercentage: {
          $cond: [
            { $eq: ["$totalSeats", 0] },
            0,
            {
              $round: [
                { $multiply: [{ $divide: ["$reservedSeats", "$totalSeats"] }, 100] },
                2,
              ],
            },
          ],
        },
      },
    },
  ]);
};

module.exports = {
  getDashboardStats,
  getBookingsPerEvent,
  getCategoryOccupancy,
};
