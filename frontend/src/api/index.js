import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ─────────────────────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ── Events ───────────────────────────────────────────────────────
export const getAllEvents = (params) => API.get("/events", { params });
export const getNearbyEvents = (params) => API.get("/events/nearby", { params });
export const getRecommendedEvents = (params) => API.get("/events/recommended", { params });
export const getEventById = (id) => API.get(`/events/${id}`);
export const createEvent = (data) => API.post("/events", data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// ── RSVP ─────────────────────────────────────────────────────────
export const rsvpEvent = (eventId, status) => API.post(`/rsvp/${eventId}`, { status });
export const getMyRSVP = (eventId) => API.get(`/rsvp/${eventId}`);
export const getMyEvents = () => API.get("/rsvp/my-events");

export default API;