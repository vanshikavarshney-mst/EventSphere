const { body, validationResult } = require("express-validator");

/**
 * authValidator.js
 * --------------------------------------------------
 * Uses express-validator to check incoming request data
 * BEFORE it reaches the controller/service layer.
 */

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
];

const loginRules = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Generic middleware that checks the results collected by the rules above
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // return the first error message
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  registerRules,
  loginRules,
  validate,
};
