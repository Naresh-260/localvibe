import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import useRSVP from "../../hooks/useRSVP.js";

const RSVPButton = ({ eventId }) => {
  const { user } = useAuth();
  const { rsvpStatus, loading, handleRSVP } = useRSVP(eventId);
  const navigate = useNavigate();

  const onClick = (status) => {
    if (!user) return navigate("/login");
    handleRSVP(status);
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => onClick("going")}
        disabled={loading}
        style={{ ...styles.btn, background: rsvpStatus === "going" ? "#27ae60" : "#eee", color: rsvpStatus === "going" ? "white" : "#333" }}
      >
        ✅ {rsvpStatus === "going" ? "Going!" : "Going"}
      </button>

      <button
        onClick={() => onClick("interested")}
        disabled={loading}
        style={{ ...styles.btn, background: rsvpStatus === "interested" ? "#f39c12" : "#eee", color: rsvpStatus === "interested" ? "white" : "#333" }}
      >
        ⭐ {rsvpStatus === "interested" ? "Interested!" : "Interested"}
      </button>
    </div>
  );
};

const styles = {
  container: { display: "flex", gap: "10px", margin: "16px 0" },
  btn: { padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" },
};

export default RSVPButton;