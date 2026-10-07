import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, LinkIcon, MapPinOff } from "lucide-react";
import axios from "axios";
import { Avatar, Brand, Button, EmptyState, FullScreenLoader, Plate } from "../components/ui";
import TripMap from "../components/map/TripMap";
import { MapScreen, Sheet, StatusPill, computeMapPadding } from "../components/map/MapScreen";
import { TripLegs } from "../components/ride/RidePanels";
import { useIsDesktop } from "../hooks/useViewport";
import useTick from "../hooks/useTick";
import { VEHICLES } from "../utils/format";
import { toLngLat } from "../utils/geo";

const POLL_MS = 5000;

const COPY = {
  pending: "Looking for a driver",
  accepted: "Driver is heading to the pickup",
  ongoing: "On the way to the destination",
  completed: "Trip finished safely",
  cancelled: "This trip was cancelled",
};

// Public, read-only live view behind a rider's "Share trip" link. No sign-in needed.
export default function Track() {
  const { token } = useParams();
  const desktop = useIsDesktop();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const [sheetHeight, setSheetHeight] = useState(0);
  const [loadedAt, setLoadedAt] = useState(Date.now());
  const now = useTick(1000);

  useEffect(() => {
    let cancelled = false;
    let timer;
    const load = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ride/track/${token}`, { timeout: 15000 });
        if (cancelled) return;
        setTrip(data);
        setError("");
        setLoadedAt(Date.now());
        if (["completed", "cancelled"].includes(data.status)) return;
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 404) {
          setError("This trip link has expired or is not valid.");
          return;
        }
      }
      timer = setTimeout(load, POLL_MS);
    };
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [token]);

  const markers = useMemo(() => {
    if (!trip) return [];
    const list = [];
    if (trip.pickupCoordinates) list.push({ kind: "pickup", lngLat: toLngLat(trip.pickupCoordinates) });
    if (trip.destinationCoordinates) list.push({ kind: "destination", lngLat: toLngLat(trip.destinationCoordinates) });
    if (trip.captain?.location) list.push({ kind: "captain", lngLat: toLngLat(trip.captain.location) });
    return list;
  }, [trip]);

  if (error) {
    return (
      <div style={{ display: "grid", minHeight: "var(--app-height)", placeItems: "center", padding: 16 }}>
        <EmptyState icon={<MapPinOff size={26} />} title="Trip link unavailable" action={<Button auto to="/">Go to QuickRide</Button>}>
          {error}
        </EmptyState>
      </div>
    );
  }
  if (!trip) return <FullScreenLoader label="Loading trip" />;

  const seconds = Math.max(0, Math.round((now - loadedAt) / 1000));
  const live = ["accepted", "ongoing"].includes(trip.status);
  const vehicle = trip.captain?.vehicle;

  return (
    <MapScreen>
      <TripMap
        markers={markers}
        padding={computeMapPadding({ desktop, sheetHeight })}
        fitKey={`${trip.status}:${trip.captain?.location ? "d" : "-"}`}
        follow={trip.captain?.location ? "captain" : undefined}
      />
      <div className="map-topbar">
        <div className="map-topbar-side"><Brand /></div>
        <StatusPill tone={live ? "live" : "default"}>{live ? "Live trip" : COPY[trip.status]}</StatusPill>
        <div className="map-topbar-side map-topbar-side--end" />
      </div>

      <Sheet label="Shared trip" onHeight={setSheetHeight}>
        <div>
          <span className="sheet-eyebrow">{trip.rider?.firstname ? `${trip.rider.firstname} is riding` : "Shared trip"}</span>
          <h1 className="sheet-title">{COPY[trip.status]}</h1>
          {live && <p className="sheet-sub" role="status">Updated {seconds < 5 ? "just now" : `${seconds}s ago`}</p>}
        </div>

        {trip.status === "completed" && (
          <div className="qr-banner qr-banner--success">
            <CheckCircle2 size={18} aria-hidden="true" /> They arrived at their destination.
          </div>
        )}

        {trip.captain && (
          <div className="person-card">
            <Avatar fullname={{ firstname: trip.captain.firstname }} />
            <div className="person-card-body">
              <strong style={{ fontSize: "var(--text-base)" }}>{trip.captain.firstname}</strong>
              {vehicle && (
                <span className="person-card-meta">
                  {vehicle.color} {VEHICLES[vehicle.type]?.name || vehicle.type}
                </span>
              )}
            </div>
            {vehicle?.number && <Plate>{vehicle.number}</Plate>}
          </div>
        )}

        <TripLegs pickup={trip.pickup} destination={trip.destination} />
        <p className="qr-hint" style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <LinkIcon size={13} aria-hidden="true" /> This link shows live location only for this trip and stops working a day after it was created.
        </p>
      </Sheet>
    </MapScreen>
  );
}
