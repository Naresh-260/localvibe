import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎯 Welcome back</h2>
        <p style={styles.sub}>Log in to RSVP and create events</p>

        {error && <div style={styles.error}>{error}</div>}

        <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button onClick={handleSubmit} disabled={loading} style={styles.btn}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.footer}>Don't have an account? <Link to="/register">Sign up</Link></p>

        {/* Demo credentials */}
        <div style={styles.demo}>
          <strong>Demo:</strong> demo@localvibe.com / localvibe123
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", background: "#f0f2f5" },
  card: { background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" },
  title: { margin: "0 0 8px", fontSize: "1.6rem", color: "#1a1a2e" },
  sub: { margin: "0 0 24px", color: "#888" },
  error: { background: "#fdecea", color: "#e74c3c", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "0.9rem" },
  input: { display: "block", width: "100%", padding: "12px", marginBottom: "14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem", boxSizing: "border-box" },
  btn: { width: "100%", padding: "12px", background: "#e94560", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" },
  footer: { textAlign: "center", marginTop: "16px", color: "#888" },
  demo: { marginTop: "16px", padding: "10px", background: "#f8f9fa", borderRadius: "6px", fontSize: "0.8rem", color: "#555", textAlign: "center" },
};

export default LoginPage;