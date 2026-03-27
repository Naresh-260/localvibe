const CATEGORIES = ["All", "Music", "Food & Drink", "Markets", "Sports", "Arts", "Community", "Nightlife", "Other"];

const FilterBar = ({ category, setCategory, radius, setRadius }) => {
  return (
    <div style={styles.bar}>
      <div style={styles.group}>
        <label style={styles.label}>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value === "All" ? "" : e.target.value)} style={styles.select}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Radius: {radius}km</label>
        <input
          type="range"
          min="1"
          max="200"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          style={styles.range}
        />
      </div>
    </div>
  );
};

const styles = {
  bar: { display: "flex", gap: "24px", alignItems: "center", padding: "10px 16px", background: "#f8f9fa", borderBottom: "1px solid #ddd", flexWrap: "wrap" },
  group: { display: "flex", alignItems: "center", gap: "8px" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#555" },
  select: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.85rem" },
  range: { width: "120px" },
};

export default FilterBar;