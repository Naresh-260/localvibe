const Event = require("../models/Event");
const RSVP = require("../models/RSVP");

// ── GET /api/events/recommended ──────────────────────────────────
// Suggest events based on the user's past RSVPs (most frequent category)
const getRecommendedEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lat, lng } = req.query; // optional, to prefer local events

    // 1. Get all events the user has RSVPed to
    const rsvps = await RSVP.find({ user: userId }).populate("event");
    
    // If no RSVPs, we can't recommend based on history, return featured/popular
    if (!rsvps.length) {
      const fallbackEvents = await Event.find({ startDate: { $gte: new Date() } })
        .sort({ isFeatured: -1, goingCount: -1 })
        .limit(5);
      return res.json({ recommended: fallbackEvents, reason: "Popular Near You" });
    }

    // 2. Find the most frequent category
    const categoryCounts = {};
    const rsvpdEventIds = [];

    rsvps.forEach(rsvp => {
      if (rsvp.event) {
        rsvpdEventIds.push(rsvp.event._id);
        const cat = rsvp.event.category;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    });

    let topCategory = null;
    let maxCount = 0;
    for (const [cat, count] of Object.entries(categoryCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topCategory = cat;
      }
    }

    // 3. Find upcoming events in that category the user hasn't RSVP'd to yet
    const query = {
      _id: { $nin: rsvpdEventIds },
      category: topCategory,
      startDate: { $gte: new Date() }
    };

    // If we have user coordinates, boost local events
    if (lat && lng) {
        query.location = {
            $geoWithin: {
                $centerSphere: [ [parseFloat(lng), parseFloat(lat)], 50 / 6378.1 ] // 50km radius
            }
        };
    }

    let recommended = await Event.find(query)
      .populate("organizer", "name avatar")
      .sort({ isFeatured: -1, startDate: 1 })
      .limit(5);

    // If not enough events in that category, pad with other popular events
    if (recommended.length < 3) {
      const moreEvents = await Event.find({
        _id: { $nin: [...rsvpdEventIds, ...recommended.map(e => e._id)] },
        startDate: { $gte: new Date() }
      })
      .sort({ isFeatured: -1, goingCount: -1 })
      .limit(5 - recommended.length);
      
      recommended = [...recommended, ...moreEvents];
    }

    res.json({ recommended, reason: `Because you went to ${topCategory} events` });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendedEvents };
