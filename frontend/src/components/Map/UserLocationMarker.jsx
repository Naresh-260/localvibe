import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom pulsing blue dot using a div icon
const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #4A90E2;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(74,144,226,0.3);
      animation: pulse 1.5s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0%   { box-shadow: 0 0 0 0 rgba(74,144,226,0.5); }
        70%  { box-shadow: 0 0 0 12px rgba(74,144,226,0); }
        100% { box-shadow: 0 0 0 0 rgba(74,144,226,0); }
      }
    </style>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
});

const UserLocationMarker = ({ location, userName }) => {
  if (!location) return null;

  return (
    <Marker position={[location.lat, location.lng]} icon={userIcon}>
      <Popup>
        <div style={styles.popup}>
          <div style={styles.avatar}>
            {userName ? userName[0].toUpperCase() : "👤"}
          </div>
          <div style={styles.info}>
            <strong style={styles.name}>{userName || "You"}</strong>
            <p style={styles.sub}>📍 Your current location</p>
            <p style={styles.coords}>
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const styles = {
  popup: { display: "flex", alignItems: "center", gap: "10px", padding: "4px", minWidth: "160px" },
  avatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#4A90E2", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "1rem", flexShrink: 0 },
  info: { flex: 1 },
  name: { fontSize: "0.95rem", color: "#1a1a2e" },
  sub: { margin: "2px 0", fontSize: "0.75rem", color: "#888" },
  coords: { margin: "2px 0", fontSize: "0.7rem", color: "#aaa" },
};

export default UserLocationMarker;