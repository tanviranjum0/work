import { useCallback, useContext, useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { SocketDataContext } from "../contexts/SocketContext";
import { useToast } from "../components/ui/Toast";
import { buzz, chime, notify } from "../utils/alerts";

const POLL_MS = 15_000;
const ACTIVE = new Set(["pending", "accepted", "ongoing"]);

/**
 * The single source of truth for a rider's or driver's current trip.
 *
 * The server owns the state: on load, on every reconnect and every 15 s while a trip is
 * live, the ride is re-read from GET /ride/active, so a refresh, a second device or a missed
 * socket event all converge to the same screen. Socket events make it feel instant.
 *
 *  ride      undefined while loading, null when idle, otherwise the client ride object
 *  ended     the trip that just finished/cancelled, shown as a summary until dismissed
 *  fix       the driver's latest live position (rider side)
 *  offers    open ride requests (driver side)
 */
export default function useRideSession(role) {
  const { socket } = useContext(SocketDataContext);
  const toast = useToast();
  const [ride, setRide] = useState(undefined);
  const [ended, setEnded] = useState(null);
  const [fix, setFix] = useState(null);
  const [offers, setOffers] = useState([]);
  const rideRef = useRef(ride);
  rideRef.current = ride;

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/ride/active");
      setRide(data.ride || null);
      if (!data.ride) setFix(null);
    } catch {
      // Keep whatever we already know; the next poll or reconnect will try again.
      setRide((current) => (current === undefined ? null : current));
    }
  }, []);

  const loadOffers = useCallback(async () => {
    if (role !== "captain") return;
    try {
      const { data } = await api.get("/ride/available");
      setOffers((current) => {
        const known = new Map(current.map((offer) => [offer._id, offer]));
        data.rides.forEach((offer) => known.set(offer._id, offer));
        return [...known.values()];
      });
    } catch {
      /* non-critical: new requests still arrive by socket */
    }
  }, [role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Heal missed events: re-read when the socket (re)connects, when the tab becomes visible
  // again, and periodically while a trip is live.
  useEffect(() => {
    const onConnect = () => refresh();
    const onVisible = () => !document.hidden && refresh();
    socket.on("connect", onConnect);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      socket.off("connect", onConnect);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [socket, refresh]);

  const live = ride && ACTIVE.has(ride.status);
  useEffect(() => {
    if (!live) return undefined;
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [live, refresh]);

  // Socket events
  useEffect(() => {
    const finish = (payload) => {
      setRide(null);
      setFix(null);
      setEnded(payload);
    };

    const onConfirmed = (data) => {
      setRide(data);
      setOffers([]);
      toast.success("Your driver is on the way.", { title: "Driver matched" });
      buzz();
      notify("Driver matched", "Your driver is on the way.");
    };
    const onStarted = (data) => {
      setRide(data);
      setFix(null);
    };
    const onEnded = (data) => finish({ ride: data, outcome: "completed" });
    const onCancelled = ({ rideId, cancelledBy, reason }) => {
      setOffers((current) => current.filter((offer) => offer._id !== rideId));
      const current = rideRef.current;
      if (!current || current._id !== rideId) return;
      finish({ ride: current, outcome: "cancelled", by: cancelledBy, reason });
      buzz([200, 80, 200]);
    };
    const onLocation = (data) => setFix(data);
    const onNewRide = (offer) => {
      if (rideRef.current) return;
      setOffers((current) => [offer, ...current.filter((item) => item._id !== offer._id)].slice(0, 10));
      chime();
      buzz([250, 100, 250]);
      notify("New ride request", `${offer.pickup}`);
    };
    const onSos = () => {
      toast.error("The other person raised a safety alert on this trip.", { title: "Safety alert", duration: 9000 });
      buzz([400, 150, 400, 150, 400]);
    };

    socket.on("ride-confirmed", onConfirmed);
    socket.on("ride-started", onStarted);
    socket.on("ride-ended", onEnded);
    socket.on("ride-cancelled", onCancelled);
    socket.on("captain-location", onLocation);
    socket.on("new-ride", onNewRide);
    socket.on("ride-sos", onSos);
    return () => {
      socket.off("ride-confirmed", onConfirmed);
      socket.off("ride-started", onStarted);
      socket.off("ride-ended", onEnded);
      socket.off("ride-cancelled", onCancelled);
      socket.off("captain-location", onLocation);
      socket.off("new-ride", onNewRide);
      socket.off("ride-sos", onSos);
    };
  }, [socket, toast]);

  // Offers expire on their own (the server cancels unaccepted requests after ~2.5 minutes).
  useEffect(() => {
    if (!offers.length) return undefined;
    const id = setInterval(() => {
      const now = Date.now();
      setOffers((current) => {
        const next = current.filter((offer) => !offer.expiresAt || new Date(offer.expiresAt).getTime() > now);
        return next.length === current.length ? current : next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [offers.length]);

  return {
    ride,
    setRide,
    ended,
    dismissEnded: () => setEnded(null),
    setEnded,
    fix,
    offers,
    dropOffer: (id) => setOffers((current) => current.filter((offer) => offer._id !== id)),
    clearOffers: () => setOffers([]),
    loadOffers,
    refresh,
  };
}
