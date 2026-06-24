const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const adminController = require("../controllers/adminController");
const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/**
 * adminRoutes.js
 * --------------------------------------------------
 * Admin-only endpoints for event management and admin user creation.
 */

router.post(
  "/event",
  authenticateUser,
  authorizeRoles("admin"),
  eventController.createEvent
);

router.put(
  "/event/:id",
  authenticateUser,
  authorizeRoles("admin"),
  eventController.updateEvent
);

router.delete(
  "/event/:id",
  authenticateUser,
  authorizeRoles("admin"),
  eventController.deleteEvent
);

router.post(
  "/users",
  authenticateUser,
  authorizeRoles("admin"),
  adminController.createAdminUser
);

router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("admin"),
  eventController.getDashboard
);

module.exports = router;
