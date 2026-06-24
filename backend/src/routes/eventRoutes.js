const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { upload, uploadToCloudinary } = require("../middleware/uploadMiddleware");
const {
  createEventRules,
  updateEventRules,
  validate,
} = require("../validators/eventValidator");

// Public routes - anyone can browse events
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

// Admin only routes
router.post(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  upload.single("image"),
  uploadToCloudinary,
  createEventRules,
  validate,
  eventController.createEvent
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  upload.single("image"),
  uploadToCloudinary,
  updateEventRules,
  validate,
  eventController.updateEvent
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  eventController.deleteEvent
);

module.exports = router;
