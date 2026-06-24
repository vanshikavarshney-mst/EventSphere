const Event = require("../models/Event");

/**
 * eventRepository.js
 * --------------------------------------------------
 * All direct database operations for the Event collection.
 */

const createEvent = async (eventData) => {
  return await Event.create(eventData);
};

const findEvent = async (id) => {
  return await Event.findById(id);
};

// Returns a Mongoose Query (not yet executed) so the service layer
// can chain ApiFeatures (search/filter/sort/paginate) onto it.
const findAllEvents = (queryObj = {}) => {
  return Event.find(queryObj);
};

const countEvents = async (queryObj = {}) => {
  return await Event.countDocuments(queryObj);
};

const updateEvent = async (id, updateData) => {
  return await Event.findByIdAndUpdate(id, updateData, {
    new: true, // return the updated document
    runValidators: true,
  });
};

const deleteEvent = async (id) => {
  return await Event.findByIdAndDelete(id);
};

// Used by bookingService to read/update seat status inside an event
const saveEvent = async (eventDoc) => {
  return await eventDoc.save();
};

module.exports = {
  createEvent,
  findEvent,
  findAllEvents,
  countEvents,
  updateEvent,
  deleteEvent,
  saveEvent,
};
