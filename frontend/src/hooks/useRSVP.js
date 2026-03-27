import { useState, useEffect } from "react";
import { rsvpEvent, getMyRSVP } from "../api/index.js";

const useRSVP = (eventId) => {
  const [rsvpStatus, setRsvpStatus] = useState(null); // "going" | "interested" | null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    getMyRSVP(eventId)
      .then((res) => setRsvpStatus(res.data.rsvp?.status || null))
      .catch(() => {});
  }, [eventId]);

  const handleRSVP = async (status) => {
    setLoading(true);
    try {
      const res = await rsvpEvent(eventId, status);
      setRsvpStatus(res.data.rsvp?.status || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { rsvpStatus, loading, handleRSVP };
};

export default useRSVP;