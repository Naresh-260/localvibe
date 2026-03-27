const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error.middleware.js");

const authRoutes = require("./routes/auth.routes.js");
const eventRoutes = require("./routes/event.routes.js");
const rsvpRoutes = require("./routes/rsvp.routes.js");

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvp", rsvpRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "LocalVibe API is running!" });
});

// Global Error Handler (must be last)
app.use(errorHandler);

module.exports = app;