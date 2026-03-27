import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/index.js";

const CATEGORIES = ["Music", "Food & Drink", "Markets", "Sports", "Arts", "Community", "Nightlife", "Other"];

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "Music",
    startDate: "", endDate: "",
    address: "", city: "", country: "",
    lat: "", lng: "",
    price: 0, image: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Address Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // Fetch address suggestions from OpenStreetMap Nominatim
  const handleAddressSearch = async (query) => {
    setForm({ ...form, address: query });
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setFetchingSuggestions(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching address suggestions:", err);
    } finally {
      setFetchingSuggestions(false);
    }
  };

  const selectAddress = (suggestion) => {
    setForm({
      ...form,
      address: suggestion.display_name,
      lat: suggestion.lat,
      lng: suggestion.lon,
    });
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.lat || !form.lng) {
      return setError("Please enter latitude and longitude for the event location.");
    }
    setLoading(true);
    try {
      await createEvent(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📍 Create New Event</h2>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Event Title *</label>
        <input style={styles.input} placeholder="e.g. Sunday Farmers Market" value={form.title} onChange={set("title")} />

        <label style={styles.label}>Description *</label>
        <textarea style={{ ...styles.input, height: "100px", resize: "vertical" }} placeholder="Tell people what to expect..." value={form.description} onChange={set("description")} />

        <label style={styles.label}>Category *</label>
        <select style={styles.input} value={form.category} onChange={set("category")}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <div style={styles.row}>
          <div style={styles.half}>
            <label style={styles.label}>Start Date & Time *</label>
            <input style={styles.input} type="datetime-local" value={form.startDate} onChange={set("startDate")} />
          </div>
          <div style={styles.half}>
            <label style={styles.label}>End Date & Time *</label>
            <input style={styles.input} type="datetime-local" value={form.endDate} onChange={set("endDate")} />
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <label style={styles.label}>Address *</label>
          <input 
            style={styles.input} 
            placeholder="Start typing an address... (e.g. Central Park, NY)" 
            value={form.address} 
            onChange={(e) => handleAddressSearch(e.target.value)} 
            onBlur={() => setTimeout(() => setSuggestions([]), 200)} // delay to allow clicks
          />
          
          {fetchingSuggestions && <div style={styles.searching}>Searching...</div>}
          
          {suggestions.length > 0 && (
            <ul style={styles.suggestionsList}>
              {suggestions.map((s, i) => (
                <li 
                  key={i} 
                  style={styles.suggestionItem}
                  onClick={() => selectAddress(s)}
                >
                  📍 {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={styles.row}>
          <div style={styles.half}>
            <label style={styles.label}>City</label>
            <input style={styles.input} placeholder="New York" value={form.city} onChange={set("city")} />
          </div>
          <div style={styles.half}>
            <label style={styles.label}>Country</label>
            <input style={styles.input} placeholder="US" value={form.country} onChange={set("country")} />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.half}>
            <label style={styles.label}>Latitude *</label>
            <input style={styles.input} placeholder="40.7128" value={form.lat} onChange={set("lat")} />
          </div>
          <div style={styles.half}>
            <label style={styles.label}>Longitude *</label>
            <input style={styles.input} placeholder="-74.0060" value={form.lng} onChange={set("lng")} />
          </div>
        </div>

        <div style={styles.tip}>
          💡 Get coordinates: Go to <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>, right-click your location → copy lat/lng
        </div>

        <label style={styles.label}>Price ($) — leave 0 for free</label>
        <input style={styles.input} type="number" min="0" value={form.price} onChange={set("price")} />

        <label style={styles.label}>Image URL (optional)</label>
        <input style={styles.input} placeholder="https://..." value={form.image} onChange={set("image")} />

        <button onClick={handleSubmit} disabled={loading} style={styles.btn}>
          {loading ? "Creating..." : "🚀 Create Event"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: "680px", margin: "30px auto", padding: "0 16px 40px" },
  card: { background: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  title: { margin: "0 0 24px", color: "#1a1a2e" },
  error: { background: "#fdecea", color: "#e74c3c", padding: "10px", borderRadius: "6px", marginBottom: "16px" },
  label: { display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "0.85rem", color: "#555" },
  input: { display: "block", width: "100%", padding: "10px 12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.95rem", boxSizing: "border-box" },
  row: { display: "flex", gap: "16px" },
  half: { flex: 1 },
  tip: { background: "#fff8e1", padding: "10px", borderRadius: "6px", fontSize: "0.8rem", color: "#856404", marginBottom: "16px" },
  btn: { width: "100%", padding: "14px", background: "#e94560", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer", marginTop: "8px" },
  searching: { fontSize: "0.8rem", color: "#888", position: "absolute", right: "12px", top: "36px" },
  suggestionsList: { position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", listStyle: "none", padding: 0, margin: "-12px 0 16px 0", maxHeight: "200px", overflowY: "auto", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  suggestionItem: { padding: "10px 12px", fontSize: "0.85rem", cursor: "pointer", borderBottom: "1px solid #eee", color: "#333", display: "flex", gap: "8px", alignItems: "flex-start", lineHeight: "1.4" },
};

export default CreateEventPage;