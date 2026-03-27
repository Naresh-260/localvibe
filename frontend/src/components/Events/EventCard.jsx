import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.js";

const CATEGORY_COLORS = {
  Music: "#9b59b6",
  "Food & Drink": "#e67e22",
  Markets: "#27ae60",
  Sports: "#2980b9",
  Arts: "#e91e63",
  Community: "#16a085",
  Nightlife: "#2c3e50",
  Other: "#7f8c8d",
};

const EventCard = ({ event, isSelected, onClick }) => {
  const color = CATEGORY_COLORS[event.category] || "#7f8c8d";

  return (
    <div onClick={onClick} style={{ ...styles.card, border: isSelected ? "2px solid #e94560" : "2px solid transparent" }}>
      {event.image && <img src={event.image} alt={event.title} style={styles.img} />}

      <div style={styles.body}>
        <div style={styles.top}>
          <span style={{ ...styles.category, background: color }}>{event.category}</span>
          {event.isFeatured && <span style={styles.featured}>⭐ Featured</span>}
        </div>

        <h3 style={styles.title}>{event.title}</h3>
        <p style={styles.date}>📅 {formatDate(event.startDate)}</p>
        <p style={styles.address}>📍 {event.location.address}</p>

        <div style={styles.footer}>
          <span style={styles.price}>{event.isFree ? "🆓 Free" : `💰 $${event.price}`}</span>
          <span style={styles.rsvp}>👥 {event.goingCount} going</span>
          <Link to={`/events/${event._id}`} style={styles.btn}>Details</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: { background: "white", borderRadius: "10px", marginBottom: "12px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden", transition: "transform 0.1s" },
  img: { width: "100%", height: "120px", objectFit: "cover" },
  body: { padding: "12px" },
  top: { display: "flex", justifyContent: "space-between", marginBottom: "6px" },
  category: { color: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "0.7rem", fontWeight: "600" },
  featured: { fontSize: "0.7rem", color: "#f39c12", fontWeight: "600" },
  title: { margin: "0 0 6px", fontSize: "0.95rem", fontWeight: "700", color: "#1a1a2e" },
  date: { margin: "2px 0", fontSize: "0.78rem", color: "#666" },
  address: { margin: "2px 0", fontSize: "0.78rem", color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" },
  price: { fontSize: "0.8rem", fontWeight: "700", color: "#27ae60" },
  rsvp: { fontSize: "0.78rem", color: "#888" },
  btn: { background: "#1a1a2e", color: "white", padding: "4px 10px", borderRadius: "6px", textDecoration: "none", fontSize: "0.75rem" },
};

export default EventCard;