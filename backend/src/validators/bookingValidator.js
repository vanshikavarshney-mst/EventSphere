const { body, validationResult } = require("express-validator");

/**
 * bookingValidator.js
 * --------------------------------------------------
 * Validation rules for creating a booking.
 */

const createBookingRules = [
  body("eventId").notEmpty().withMessage("Event id is required"),
  body("seats")
    .isArray({ min: 1 })
    .withMessage("Please select at least one seat"),
  body("seats.*").isString().withMessage("Each seat must be a seat number string"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  createBookingRules,
  validate,
};
