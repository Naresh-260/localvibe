import { Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.js";

const EventPopup = ({ event }) => {
  return (
    <Popup>
      <div style={styles.popup}>
        {event.image && <img src={event.image} alt={event.title} style={styles.img} />}
        <span style={styles.category}>{event.category}</span>
        <h3 style={styles.title}>{event.title}</h3>
        <p style={styles.date}>📅 {formatDate(event.startDate)}</p>
        <p style={styles.address}>📍 {event.location.address}</p>
        <p style={styles.price}>{event.isFree ? "🆓 Free" : `💰 $${event.price}`}</p>
        <Link to={`/events/${event._id}`} style={styles.btn}>View Details →</Link>
      </div>
    </Popup>
  );
};

const styles = {
  popup: { width: "200px", fontFamily: "sans-serif" },
  img: { width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px", marginBottom: "8px" },
  category: { background: "#e94560", color: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "0.7rem" },
  title: { margin: "6px 0 4px", fontSize: "1rem" },
  date: { margin: "2px 0", fontSize: "0.8rem", color: "#555" },
  address: { margin: "2px 0", fontSize: "0.8rem", color: "#555" },
  price: { margin: "2px 0", fontSize: "0.8rem", fontWeight: "bold" },
  btn: { display: "inline-block", marginTop: "8px", background: "#1a1a2e", color: "white", padding: "6px 12px", borderRadius: "6px", textDecoration: "none", fontSize: "0.8rem" },
};

export default EventPopup;