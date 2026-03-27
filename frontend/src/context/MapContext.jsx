import { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [center, setCenter] = useState([40.7128, -74.006]); // Default: New York
  const [zoom, setZoom] = useState(13);
  const [radius, setRadius] = useState(5); // km
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <MapContext.Provider value={{ center, setCenter, zoom, setZoom, radius, setRadius, selectedEvent, setSelectedEvent }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);