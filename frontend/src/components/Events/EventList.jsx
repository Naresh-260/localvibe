import EventCard from "./EventCard.jsx";

const EventList = ({ events, loading, selectedEvent, onSelectEvent }) => {
  if (loading) {
    return <div style={styles.center}>🔍 Finding events near you...</div>;
  }

  if (!events.length) {
    return <div style={styles.center}>😕 No events found in this area.<br />Try increasing the radius.</div>;
  }

  return (
    <div style={styles.list}>
      <p style={styles.count}>{events.length} event{events.length !== 1 ? "s" : ""} found</p>
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          isSelected={selectedEvent?._id === event._id}
          onClick={() => onSelectEvent(event)}
        />
      ))}
    </div>
  );
};

const styles = {
  list: { padding: "12px", overflowY: "auto", height: "100%" },
  count: { fontSize: "0.8rem", color: "#888", margin: "0 0 12px" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "200px", textAlign: "center", color: "#888", padding: "20px", lineHeight: "1.6" },
};

export default EventList;