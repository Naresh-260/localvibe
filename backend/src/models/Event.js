const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Music",
        "Food & Drink",
        "Markets",
        "Sports",
        "Arts",
        "Community",
        "Nightlife",
        "Other",
      ],
    },

    // ── Dates ──────────────────────────────────────────────
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    // ── Location (GeoJSON Point — required for 2dsphere queries) ──
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]  ← MongoDB order!
        required: [true, "Coordinates are required"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: String,
      country: String,
    },

    // ── Media & Price ───────────────────────────────────────
    image: {
      type: String, // URL to image
      default: "",
    },
    price: {
      type: Number,
      default: 0, // 0 = Free
      min: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
    },

    // ── Organizer ───────────────────────────────────────────
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── RSVP Counts (denormalized for performance) ──────────
    goingCount: {
      type: Number,
      default: 0,
    },
    interestedCount: {
      type: Number,
      default: 0,
    },

    // ── Monetization ────────────────────────────────────────
    isFeatured: {
      type: Boolean,
      default: false, // true = gold pin on map, paid upgrade
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── 2dsphere Index — THIS is what makes geospatial queries work ──
EventSchema.index({ location: "2dsphere" });

// ── Text search index ────────────────────────────────────────────
EventSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Event", EventSchema);