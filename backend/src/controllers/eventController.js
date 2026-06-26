const eventService = require("../services/eventService");
const dashboardService = require("../services/dashboardService");

/**
 * eventController.js
 * --------------------------------------------------
 * Handles all HTTP requests related to events.
 */

// POST /api/events (admin only)
const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user._id, req.imageUrl);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events  (supports ?search, ?category, ?status, ?date, ?page, ?limit, ?sort)
const getAllEvents = async (req, res, next) => {
  try {
    const { events, total, page, limit, totalPages } = await eventService.getAllEvents(req.query);

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      events,
      total,
      page,
      limit,
      totalPages,
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/events/:id (admin only)
const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body, req.imageUrl);

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/events/:id (admin only)
const deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/dashboard (admin only)
const getDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    const bookingsPerEvent = await dashboardService.getBookingsPerEvent();
    const categoryOccupancy = await dashboardService.getCategoryOccupancy();

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        ...stats,
        bookingsPerEvent,
        categoryOccupancy,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getDashboard,
};
