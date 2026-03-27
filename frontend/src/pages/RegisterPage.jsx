import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎯 Join LocalVibe</h2>
        <p style={styles.sub}>Discover events happening near you</p>

        {error && <div style={styles.error}>{error}</div>}

        <input style={styles.input} placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button onClick={handleSubmit} disabled={loading} style={styles.btn}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={styles.footer}>Already have an account? <Link to="/login">Login</Link></p>
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
};

export default RegisterPage;