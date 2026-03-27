import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import RSVPButton from "../components/RSVP/RSVPButton.jsx";
import { formatDateTime } from "../utils/formatDate.js";

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventById(id)
      .then((res) => setEvent(res.data.event))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this event?")) return;
    await deleteEvent(id);
    navigate("/");
  };

  if (loading) return <div style={styles.center}>Loading event...</div>;
  if (!event) return <div style={styles.center}>Event not found</div>;

  const isOrganizer = user && user.id === event.organizer?._id;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {event.image && <img src={event.image} alt={event.title} style={styles.img} />}

        <div style={styles.body}>
          <div style={styles.top}>
            <span style={styles.category}>{event.category}</span>
            {event.isFeatured && <span style={styles.featured}>⭐ Featured Event</span>}
          </div>

          <h1 style={styles.title}>{event.title}</h1>

          <div style={styles.meta}>
            <p>📅 <strong>Start:</strong> {formatDateTime(event.startDate)}</p>
            <p>🏁 <strong>End:</strong> {formatDateTime(event.endDate)}</p>
            <p>📍 <strong>Location:</strong> {event.location.address}</p>
            <p>💰 <strong>Price:</strong> {event.isFree ? "Free" : `$${event.price}`}</p>
            <p>👤 <strong>Organizer:</strong> {event.organizer?.name}</p>
            <p>👥 <strong>Attendees:</strong> {event.goingCount} going · {event.interestedCount} interested
              {event.friendsGoing > 0 && <span style={{ color: "#e94560", marginLeft: "8px", fontWeight: "bold" }}>✨ {event.friendsGoing} friends are going</span>}
            </p>
          </div>

          <p style={styles.description}>{event.description}</p>

          <RSVPButton eventId={event._id} />

          {isOrganizer && (
            <div style={styles.actions}>
              <button onClick={() => navigate(`/edit-event/${event._id}`)} style={styles.editBtn}>✏️ Edit</button>
              <button onClick={handleDelete} style={styles.deleteBtn}>🗑️ Delete</button>
            </div>
          )}

          <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: "700px", margin: "30px auto", padding: "0 16px" },
  card: { background: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", overflow: "hidden" },
  img: { width: "100%", height: "300px", objectFit: "cover" },
  body: { padding: "24px" },
  top: { display: "flex", gap: "10px", marginBottom: "12px" },
  category: { background: "#e94560", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem" },
  featured: { background: "#f39c12", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem" },
  title: { fontSize: "1.8rem", margin: "0 0 16px", color: "#1a1a2e" },
  meta: { background: "#f8f9fa", borderRadius: "8px", padding: "16px", marginBottom: "16px", lineHeight: "1.8" },
  description: { color: "#555", lineHeight: "1.7", marginBottom: "16px" },
  actions: { display: "flex", gap: "10px", margin: "16px 0" },
  editBtn: { background: "#3498db", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  deleteBtn: { background: "#e74c3c", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  back: { background: "transparent", border: "1px solid #ddd", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", marginTop: "8px" },
  center: { textAlign: "center", padding: "60px", color: "#888" },
};

export default EventDetailPage;