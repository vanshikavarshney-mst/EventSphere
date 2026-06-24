const { body, validationResult } = require("express-validator");

/**
 * eventValidator.js
 * --------------------------------------------------
 * Validation rules for creating/updating an event.
 */

const createEventRules = [
  body("title").trim().notEmpty().withMessage("Event title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("venue").trim().notEmpty().withMessage("Venue is required"),
  body("date").notEmpty().withMessage("Event date is required").isISO8601().withMessage("Date must be a valid date"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
];

const updateEventRules = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("date").optional().isISO8601().withMessage("Date must be a valid date"),
  body("status")
    .optional()
    .isIn(["Upcoming", "Live", "Completed", "Cancelled"])
    .withMessage("Invalid status value"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
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
  createEventRules,
  updateEventRules,
  validate,
};
