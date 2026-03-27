const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config/env");

const protect = async (req, res, next) => {
  try {
    let token;

    // Token comes in the Authorization header as: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized. Please log in." });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user to request (without password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Only allow certain roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role '${req.user.role}' is not allowed` });
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch (error) {
    // Ignore token errors for optional auth
  }
  next();
};

module.exports = { protect, authorize, optionalAuth };