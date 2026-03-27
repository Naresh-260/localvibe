import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🎯 LocalVibe</Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Map</Link>

        {user ? (
          <>
            <Link to="/create-event" style={styles.link}>+ Add Event</Link>
            <Link to="/profile" style={styles.link}>👤 {user.name}</Link>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btnLink}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", background: "#1a1a2e", color: "white", position: "sticky", top: 0, zIndex: 1000 },
  brand: { fontSize: "1.4rem", fontWeight: "bold", color: "white", textDecoration: "none" },
  links: { display: "flex", alignItems: "center", gap: "16px" },
  link: { color: "white", textDecoration: "none", fontSize: "0.95rem" },
  btn: { background: "transparent", border: "1px solid white", color: "white", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" },
  btnLink: { background: "#e94560", color: "white", padding: "6px 14px", borderRadius: "6px", textDecoration: "none", fontSize: "0.95rem" },
};

export default Navbar;