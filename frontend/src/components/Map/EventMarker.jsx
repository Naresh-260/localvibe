import { Marker } from "react-leaflet";
import L from "leaflet";
import EventPopup from "./EventPopup.jsx";

// Regular pin (blue)
const regularIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Featured pin (gold — bigger)
const featuredIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 49], // bigger than regular
  iconAnchor: [15, 49],
  popupAnchor: [1, -34],
});

const EventMarker = ({ event }) => {
  const [lng, lat] = event.location.coordinates;

  return (
    <Marker
      position={[lat, lng]}
      icon={event.isFeatured ? featuredIcon : regularIcon}
    >
      <EventPopup event={event} />
    </Marker>
  );
};

export default EventMarker;