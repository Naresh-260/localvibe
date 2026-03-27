const express = require("express");
const router = express.Router();
const {
  getNearbyEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");
const { getRecommendedEvents } = require("../controllers/recommendation.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");

// Public routes
router.get("/nearby", getNearbyEvents);  // GET /api/events/nearby?lat=&lng=&radius=
router.get("/recommended", protect, getRecommendedEvents); // GET /api/events/recommended
router.get("/", getAllEvents);            // GET /api/events
router.get("/:id", optionalAuth, getEventById);        // GET /api/events/:id

// Protected routes (must be logged in)
router.post("/", protect, createEvent);          // POST /api/events
router.put("/:id", protect, updateEvent);        // PUT /api/events/:id
router.delete("/:id", protect, deleteEvent);     // DELETE /api/events/:id

module.exports = router;