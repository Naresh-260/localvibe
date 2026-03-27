import { useState } from "react";
import { useMap } from "react-leaflet";

// This component lives INSIDE MapContainer so it can access the map
const FlyToCity = ({ coords }) => {
  const map = useMap();
  if (coords) map.flyTo(coords, 13);
  return null;
};

const CitySearch = ({ onLocationChange }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flyTo, setFlyTo] = useState(null);

  const searchCity = async (value) => {
    setQuery(value);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Using OpenStreetMap Nominatim API — free, no key needed
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectCity = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setQuery(place.display_name.split(",")[0]); // show just city name
    setSuggestions([]);
    setFlyTo([lat, lng]);
    onLocationChange({ lat, lng }); // update events fetch
  };

  return (
    <>
      {flyTo && <FlyToCity coords={flyTo} />}
      <div style={styles.container}>
        <div style={styles.inputWrapper}>
          <span style={styles.icon}>🏙️</span>
          <input
            style={styles.input}
            type="text"
            placeholder="Search any city..."
            value={query}
            onChange={(e) => searchCity(e.target.value)}
          />
          {loading && <span style={styles.spinner}>⏳</span>}
          {query && !loading && (
            <button onClick={() => { setQuery(""); setSuggestions([]); }} style={styles.clear}>✕</button>
          )}
        </div>

        {suggestions.length > 0 && (
          <ul style={styles.dropdown}>
            {suggestions.map((place) => (
              <li
                key={place.place_id}
                style={styles.item}
                onClick={() => selectCity(place)}
                onMouseEnter={(e) => e.target.style.background = "#f0f2f5"}
                onMouseLeave={(e) => e.target.style.background = "white"}
              >
                <span style={styles.pin}>📍</span>
                <div>
                  <div style={styles.cityName}>{place.display_name.split(",")[0]}</div>
                  <div style={styles.cityFull}>{place.display_name.split(",").slice(1, 3).join(",")}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

const styles = {
  container: { position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, width: "320px" },
  inputWrapper: { display: "flex", alignItems: "center", background: "white", borderRadius: "10px", padding: "8px 12px", gap: "8px", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" },
  icon: { fontSize: "1rem", flexShrink: 0 },
  input: { flex: 1, border: "none", outline: "none", fontSize: "0.95rem", background: "transparent" },
  spinner: { fontSize: "0.8rem" },
  clear: { background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: "0.85rem" },
  dropdown: { listStyle: "none", margin: "4px 0 0", padding: 0, background: "white", borderRadius: "10px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", overflow: "hidden" },
  item: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", cursor: "pointer", transition: "background 0.15s" },
  pin: { fontSize: "1rem", flexShrink: 0 },
  cityName: { fontWeight: "600", fontSize: "0.9rem", color: "#1a1a2e" },
  cityFull: { fontSize: "0.75rem", color: "#888" },
};

export default CitySearch;