const Event = require("../models/Event");
const RSVP = require("../models/RSVP");
const User = require("../models/User");

// ── GET /api/events/nearby ───────────────────────────────────────
// Query params: lat, lng, radius (km), category, startDate
const getNearbyEvents = async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius = 5,
      category,
      startDate,
      page = 1,
      limit = 20,
    } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng are required" });
    }

    // Convert km to radians (required by $geoWithin $centerSphere)
    const radiusInRadians = parseFloat(radius) / 6378.1;

    const query = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            radiusInRadians,
          ],
        },
      },
    };

    if (category) query.category = category;
    if (startDate) query.startDate = { $gte: new Date(startDate) };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const events = await Event.find(query)
      .populate("organizer", "name avatar")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({
      events,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ── GET /api/events ──────────────────────────────────────────────
const getAllEvents = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find(query)
      .populate("organizer", "name avatar")
      .sort({ isFeatured: -1, startDate: 1 }) // featured first, then by date
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({ events, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/events/:id ──────────────────────────────────────────
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name avatar email");
    if (!event) return res.status(404).json({ message: "Event not found" });

    let friendsGoing = 0;
    if (req.user && req.user.following && req.user.following.length > 0) {
      friendsGoing = await RSVP.countDocuments({
        event: event._id,
        user: { $in: req.user.following },
        status: "going"
      });
    }

    res.json({ event: { ...event.toJSON(), friendsGoing } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/events ─────────────────────────────────────────────
const createEvent = async (req, res) => {
  try {
    const { title, description, category, startDate, endDate, address, city, country, lat, lng, price, image } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      startDate,
      endDate,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)], // [lng, lat]
        address,
        city,
        country,
      },
      price: parseFloat(price) || 0,
      isFree: !price || parseFloat(price) === 0,
      image: image || "",
      organizer: req.user.id, // from JWT middleware
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PUT /api/events/:id ──────────────────────────────────────────
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only organizer or admin can update
    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }

    const { lat, lng, address, city, country, price, ...rest } = req.body;

    if (lat && lng) {
      rest.location = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
        address,
        city,
        country,
      };
    }

    if (price !== undefined) {
      rest.price = parseFloat(price);
      rest.isFree = parseFloat(price) === 0;
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true });
    res.json({ message: "Event updated", event: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE /api/events/:id ───────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNearbyEvents, getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };