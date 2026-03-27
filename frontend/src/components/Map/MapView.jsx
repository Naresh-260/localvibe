import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import EventMarker from "./EventMarker.jsx";
import UserLocationMarker from "./UserLocationMarker.jsx";
import CitySearch from "./CitySearch.jsx";

const RecenterMap = ({ center }) => {
  const map = useMap();
  map.flyTo(center, 13);
  return null;
};

const MapView = ({ events, center, userLocation, userName, onLocationChange }) => {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} />

        {/* City search box floating on map */}
        <CitySearch onLocationChange={onLocationChange} />

        {/* Pulsing user location dot */}
        <UserLocationMarker location={userLocation} userName={userName} />

        {/* Event pins */}
        {events.map((event) => (
          <EventMarker key={event._id} event={event} />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;