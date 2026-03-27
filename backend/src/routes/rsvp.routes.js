const express = require("express");
const router = express.Router();
const { rsvpToEvent, getMyRSVP, getMyEvents } = require("../controllers/rsvp.controller");
const { protect } = require("../middleware/auth.middleware");

// All RSVP routes require login
router.use(protect);

router.get("/my-events", getMyEvents);          // GET  /api/rsvp/my-events
router.get("/:eventId", getMyRSVP);             // GET  /api/rsvp/:eventId
router.post("/:eventId", rsvpToEvent);          // POST /api/rsvp/:eventId

module.exports = router;