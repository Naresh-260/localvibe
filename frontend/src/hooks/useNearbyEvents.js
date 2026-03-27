import { useState, useEffect } from "react";
import { getNearbyEvents } from "../api/index.js";

const useNearbyEvents = (lat, lng, radius, category) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = { lat, lng, radius };
        if (category) params.category = category;
        const res = await getNearbyEvents(params);
        setEvents(res.data.events);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [lat, lng, radius, category, refreshKey]);

  return { events, loading, error, refetch };
};

export default useNearbyEvents;