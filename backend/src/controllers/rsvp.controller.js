const RSVP = require("../models/RSVP");
const Event = require("../models/Event");

// ── POST /api/rsvp/:eventId ──────────────────────────────────────
// Body: { status: "going" | "interested" }
// If same status sent again → removes RSVP (toggle off)
const rsvpToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!["going", "interested"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'going' or 'interested'" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = await RSVP.findOne({ user: userId, event: eventId });

    // ── Toggle OFF: same status clicked again ────────────────────
    if (existing && existing.status === status) {
      await existing.deleteOne();

      // Decrement the count on Event
      if (status === "going") {
        event.goingCount = Math.max(0, event.goingCount - 1);
      } else {
        event.interestedCount = Math.max(0, event.interestedCount - 1);
      }
      await event.save();

      return res.json({ message: "RSVP removed", rsvp: null, event });
    }

    // ── Switching status (going → interested or vice versa) ──────
    if (existing && existing.status !== status) {
      // Undo old count
      if (existing.status === "going") event.goingCount = Math.max(0, event.goingCount - 1);
      else event.interestedCount = Math.max(0, event.interestedCount - 1);

      // Apply new status
      existing.status = status;
      await existing.save();

      if (status === "going") event.goingCount += 1;
      else event.interestedCount += 1;

      await event.save();
      return res.json({ message: "RSVP updated", rsvp: existing, event });
    }

    // ── New RSVP ─────────────────────────────────────────────────
    const rsvp = await RSVP.create({ user: userId, event: eventId, status });

    if (status === "going") event.goingCount += 1;
    else event.interestedCount += 1;
    await event.save();

    res.status(201).json({ message: "RSVP saved", rsvp, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/rsvp/:eventId ───────────────────────────────────────
// Get current user's RSVP status for an event
const getMyRSVP = async (req, res) => {
  try {
    const rsvp = await RSVP.findOne({ user: req.user.id, event: req.params.eventId });
    res.json({ rsvp }); // null if not RSVPed
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/rsvp/my-events ──────────────────────────────────────
// All events the logged-in user RSVPed to
const getMyEvents = async (req, res) => {
  try {
    const rsvps = await RSVP.find({ user: req.user.id })
      .populate({
        path: "event",
        populate: { path: "organizer", select: "name avatar" },
      })
      .sort({ createdAt: -1 });

    res.json({ rsvps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { rsvpToEvent, getMyRSVP, getMyEvents };