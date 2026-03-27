import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val.trim()); // search on every keystroke
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <span style={styles.icon}>🔍</span>
        <input
          style={styles.input}
          type="text"
          placeholder="Search events by name, description or address..."
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button onClick={handleClear} style={styles.clear}>✕</button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "10px 16px", background: "#fff", borderBottom: "1px solid #ddd" },
  wrapper: { display: "flex", alignItems: "center", background: "#f0f2f5", borderRadius: "10px", padding: "6px 12px", gap: "8px", maxWidth: "600px" },
  icon: { fontSize: "1rem", flexShrink: 0 },
  input: { flex: 1, border: "none", background: "transparent", fontSize: "0.95rem", outline: "none", padding: "4px 0" },
  clear: { background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: "0.9rem", padding: "2px 6px" },
  btn: { background: "#e94560", color: "white", border: "none", borderRadius: "8px", padding: "6px 16px", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem", flexShrink: 0 },
};

export default SearchBar;