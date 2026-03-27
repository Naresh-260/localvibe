import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MapView from "../components/Map/MapView.jsx";
import EventList from "../components/Events/EventList.jsx";
import FilterBar from "../components/UI/FilterBar.jsx";
import SearchBar from "../components/UI/SearchBar.jsx";
import useGeolocation from "../hooks/useGeolocation.js";
import useNearbyEvents from "../hooks/useNearbyEvents.js";
import { useAuth } from "../context/AuthContext.jsx";

const HomePage = () => {
  const [category, setCategory] = useState("");
  const [radius, setRadius] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mapCenter, setMapCenter] = useState(null); // city search overrides GPS

  // Recommendations state
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [recommendationReason, setRecommendationReason] = useState("");
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const routerLocation = useLocation();
  const { user } = useAuth();
  const { location, loading: locLoading } = useGeolocation();

  // Use city search location if set, otherwise use GPS
  const activeLocation = mapCenter || location;

  const { events, loading: eventsLoading, refetch } = useNearbyEvents(
    activeLocation?.lat,
    activeLocation?.lng,
    radius,
    category
  );

  // Refetch every time user navigates back to HomePage
  useEffect(() => {
    refetch();

    if (user) {
      setLoadingRecommendations(true);
      import("../api/index.js").then(({ getRecommendedEvents }) => {
        getRecommendedEvents({ lat: activeLocation?.lat, lng: activeLocation?.lng })
          .then((res) => {
            setRecommendedEvents(res.data.recommended || []);
            setRecommendationReason(res.data.reason || "Recommended for you");
          })
          .catch(console.error)
          .finally(() => setLoadingRecommendations(false));
      });
    }
  }, [routerLocation.key, user, activeLocation?.lat, activeLocation?.lng]);

  // When city search picks a location, update map center
  const handleLocationChange = (newLocation) => {
    setMapCenter(newLocation);
  };

  const filteredEvents = searchQuery
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  const center = activeLocation
    ? [activeLocation.lat, activeLocation.lng]
    : [17.3850, 78.4867]; // default Hyderabad

  if (locLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "1.2rem" }}>
        📍 Detecting your location...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
      <SearchBar onSearch={setSearchQuery} />
      <FilterBar
        category={category}
        setCategory={setCategory}
        radius={radius}
        setRadius={setRadius}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: "380px", overflowY: "auto", background: "#f8f9fa", borderRight: "1px solid #ddd", flexShrink: 0 }}>
          <div style={{ padding: "8px 12px", background: "#fff", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "#888" }}>
              {filteredEvents.length} events found
              {mapCenter && <span style={{ color: "#e94560", marginLeft: "6px" }}>📍 Custom location</span>}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {mapCenter && (
                <button
                  onClick={() => setMapCenter(null)}
                  style={{ background: "none", border: "1px solid #e94560", color: "#e94560", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "0.75rem" }}
                >
                  Use My Location
                </button>
              )}
              <button
                onClick={refetch}
                style={{ background: "none", border: "1px solid #ddd", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "0.8rem" }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Recommendations Section */}
          {user && recommendedEvents.length > 0 && !searchQuery && !category && (
            <div style={{ padding: "12px", background: "#fdfbf7", borderBottom: "1px solid #f1e2c3" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "1.2rem" }}>✨</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "0.95rem", color: "#b8860b" }}>Recommended</h3>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#888" }}>{recommendationReason}</p>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "thin" }}>
                {recommendedEvents.map(event => (
                  <div 
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    style={{ 
                      minWidth: "220px", 
                      background: "white", 
                      border: "1px solid #eee", 
                      borderRadius: "8px", 
                      padding: "8px",
                      cursor: "pointer",
                      boxShadow: selectedEvent?._id === event._id ? "0 0 0 2px #e94560" : "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ fontSize: "0.85rem", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "4px" }}>
                      {new Date(event.startDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <EventList
            events={filteredEvents}
            loading={eventsLoading}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapView
            events={filteredEvents}
            center={center}
            userLocation={location}
            userName={user?.name}
            onLocationChange={handleLocationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;