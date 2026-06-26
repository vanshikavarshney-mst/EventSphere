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
  const seats = generateSeats({
  frontSeats: eventData.frontSeats,
  middleSeats: eventData.middleSeats,
  backSeats: eventData.backSeats,
  frontPrice: eventData.frontPrice,
  middlePrice: eventData.middlePrice,
  backPrice: eventData.backPrice,
});

  const event = await eventRepository.createEvent({
    ...eventData,
    image: imageUrl || eventData.image || "",
    seats,
    createdBy: adminId,
    seatPricing: {
  front: eventData.frontPrice,
  middle: eventData.middlePrice,
  back: eventData.backPrice,
},
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
  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 10;

  const features = new ApiFeatures(baseQuery, queryParams)
    .search(["title"])
    .filter(["category", "status", "date"])
    .sort()
    .paginate();

  const events = await features.query;
  const total = await eventRepository.countEvents(); // simple total count
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { events, total, page, limit, totalPages };
};

// Admin updates event details (not seats directly)
const updateEvent = async (id, updateData, imageUrl) => {
  const event = await getEventById(id);

  // Basic fields
  event.title = updateData.title;
  event.description = updateData.description;
  event.venue = updateData.venue;
  event.date = updateData.date;
  event.category = updateData.category;
  event.status = updateData.status;

  if (imageUrl) {
  event.image = imageUrl;
} else if (updateData.image) {
  event.image = updateData.image;
}

  // Update event pricing
  event.seatPricing = {
    front: Number(updateData.frontPrice),
    middle: Number(updateData.middlePrice),
    back: Number(updateData.backPrice),
  };

  // Update prices of AVAILABLE seats only
  event.seats.forEach((seat) => {
    if (seat.status === "Available") {
      if (seat.category === "Front") {
        seat.price = Number(updateData.frontPrice);
      }

      if (seat.category === "Middle") {
        seat.price = Number(updateData.middlePrice);
      }

      if (seat.category === "Back") {
        seat.price = Number(updateData.backPrice);
      }
    }
  });

  await event.save();

  return event;
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
