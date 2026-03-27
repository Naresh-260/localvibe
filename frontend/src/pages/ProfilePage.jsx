import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyEvents } from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../utils/formatDate.js";

const ProfilePage = () => {
  const { user } = useAuth();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEvents()
      .then((res) => setRsvps(res.data.rsvps))
      .finally(() => setLoading(false));
  }, []);

  const going = rsvps.filter((r) => r.status === "going");
  const interested = rsvps.filter((r) => r.status === "interested");

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
        <div>
          <h2 style={styles.name}>{user?.name}</h2>
          <p style={styles.email}>{user?.email}</p>
          <span style={styles.role}>{user?.role}</span>
        </div>
      </div>

      {loading ? (
        <div style={styles.center}>Loading your events...</div>
      ) : (
        <>
          <Section title={`✅ Going (${going.length})`} rsvps={going} />
          <Section title={`⭐ Interested (${interested.length})`} rsvps={interested} />
        </>
      )}
    </div>
  );
};

const Section = ({ title, rsvps }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    {rsvps.length === 0 ? (
      <p style={styles.empty}>No events here yet. <Link to="/">Browse events →</Link></p>
    ) : (
      rsvps.map(({ event }) => event && (
        <Link to={`/events/${event._id}`} key={event._id} style={styles.card}>
          <div>
            <strong>{event.title}</strong>
            <p style={styles.meta}>📅 {formatDate(event.startDate)} · 📍 {event.location?.address}</p>
          </div>
          <span style={styles.arrow}>→</span>
        </Link>
      ))
    )}
  </div>
);

const styles = {
  page: { maxWidth: "680px", margin: "30px auto", padding: "0 16px 40px" },
  header: { display: "flex", alignItems: "center", gap: "20px", background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", marginBottom: "24px" },
  avatar: { width: "64px", height: "64px", borderRadius: "50%", background: "#e94560", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: "700", flexShrink: 0 },
  name: { margin: "0 0 4px", fontSize: "1.4rem" },
  email: { margin: "0 0 6px", color: "#888", fontSize: "0.9rem" },
  role: { background: "#1a1a2e", color: "white", padding: "2px 10px", borderRadius: "10px", fontSize: "0.75rem" },
  section: { background: "white", borderRadius: "12px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
  sectionTitle: { margin: "0 0 16px", fontSize: "1.1rem" },
  card: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: "8px", border: "1px solid #eee", marginBottom: "8px", textDecoration: "none", color: "inherit" },
  meta: { margin: "4px 0 0", fontSize: "0.8rem", color: "#888" },
  arrow: { color: "#e94560", fontWeight: "700" },
  empty: { color: "#888", fontSize: "0.9rem" },
  center: { textAlign: "center", padding: "40px", color: "#888" },
};

export default ProfilePage;