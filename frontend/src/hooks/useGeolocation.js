import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        // If user denies, default to New York
        setLocation({ lat: 40.7128, lng: -74.006 });
        setError("Location access denied. Showing New York.");
        setLoading(false);
      }
    );
  }, []);

  return { location, error, loading };
};

export default useGeolocation;