const eventRepository = require("../repositories/eventRepository");
const generateSeats = require("../utils/generateSeats");
const ApiFeatures = require("../utils/apiFeatures");

/**
 * eventService.js
 * --------------------------------------------------
 * Business logic for creating, reading, updating and deleting events.
 */

// Admin creates a new event. Seats are auto-generated at creation time.
const createEvent = async (eventData, adminId, imageUrl) => {
  const seats = generateSeats(eventData.price);

  const event = await eventRepository.createEvent({
    ...eventData,
    image: imageUrl ||  "",
    seats,
    createdBy: adminId,
  });

  return event;
};

// Get a single event by id
const getEventById = async (id) => {
  const event = await eventRepository.findEvent(id);

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  return event;
};

/**
 * Get all events with search, filter, sort & pagination support.
 * Supported query params:
 *   ?search=tech        -> matches title
 *   ?category=Workshop   -> exact match
 *   ?status=Upcoming     -> exact match
 *   ?date=2026-01-01     -> exact match
 *   ?page=1&limit=10     -> pagination
 *   ?sort=date / -date   -> sorting
 */
const getAllEvents = async (queryParams) => {
  const baseQuery = eventRepository.findAllEvents();

  const features = new ApiFeatures(baseQuery, queryParams)
    .search(["title"])
    .filter(["category", "status", "date"])
    .sort()
    .paginate();

  const events = await features.query;
  const total = await eventRepository.countEvents(); // simple total count

  return { events, total };
};

// Admin updates event details (not seats directly)
const updateEvent = async (id, updateData, imageUrl) => {
  const event = await getEventById(id);

  const dataToUpdate = { ...updateData };
  if (imageUrl) {
    dataToUpdate.image = imageUrl;
  }

  const updatedEvent = await eventRepository.updateEvent(id, dataToUpdate);
  return updatedEvent;
};

// Admin deletes an event
const deleteEvent = async (id) => {
  const event = await getEventById(id); // throws 404 if not found
  await eventRepository.deleteEvent(id);
  return event;
};

module.exports = {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
};
