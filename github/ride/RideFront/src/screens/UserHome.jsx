import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { LocateFixed, Menu, Navigation, ShieldCheck, WifiOff } from "lucide-react";
import api, { getApiErrorMessage } from "../utils/api";
import { useUser } from "../contexts/UserContext";
import useRideSession from "../hooks/useRideSession";
import useGeolocation from "../hooks/useGeolocation";
import useLiveRoute from "../hooks/useLiveRoute";
import { useIsDesktop, useOnlineStatus } from "../hooks/useViewport";
import { Banner, Button, useToast } from "../components/ui";
import AccountDrawer from "../components/AccountDrawer";
import TripMap from "../components/map/TripMap";
import { MapButton, MapScreen, MapTopBar, Sheet, StatusPill, computeMapPadding } from "../components/map/MapScreen";
import {
  PlaceSearchBody,
  PlaceSearchFooter,
  SearchingBody,
  VehicleOptionsBody,
} from "../components/ride/RidePanels";
import { CancelDialog, SafetyDialog, SummaryBody, TripActions, TripBody, TripDetails, shareTripLink } from "../components/ride/RideTrip";
import { formatDuration, money } from "../utils/format";
import { toLngLat } from "../utils/geo";

const unique = (list) => [...new Set(list.filter(Boolean))];

export default function UserHome() {
  const toast = useToast();
  const location = useLocation();
  const { user } = useUser();
  const desktop = useIsDesktop();
  const online = useOnlineStatus();
  const { ride, setRide, ended, dismissEnded, fix, refresh } = useRideSession("user");
  const geo = useGeolocation();
  const mapRef = useRef(null);

  const [drawer, setDrawer] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [following, setFollowing] = useState(true);
  const [safety, setSafety] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hideNudge, setHideNudge] = useState(false);

  // Search & options (only meaningful while no ride is active)
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [active, setActive] = useState("destination");
  const [vehicle, setVehicle] = useState("car");
  const [quote, setQuote] = useState(null); // { fare, distanceTime }
  const [pin, setPin] = useState(null); // { ltd, lng } for a long-press pickup
  const [locating, setLocating] = useState(false);

  const phase = ended
    ? "summary"
    : ride === undefined
      ? "loading"
      : ride
        ? { pending: "searching", accepted: "matched", ongoing: "ongoing" }[ride.status]
        : quote
          ? "options"
          : "search";

  /* -------------------------------------------------------- pickup from GPS */

  const locateMe = useCallback(async () => {
    setLocating(true);
    setError("");
    const here = await geo.locate();
    if (!here) {
      setLocating(false);
      return;
    }
    setPin(null);
    try {
      const { data } = await api.get("/map/reverse", { params: { lat: here.ltd, lng: here.lng } });
      setPickup(data.address || `${here.ltd},${here.lng}`);
    } catch {
      setPickup(`${here.ltd},${here.lng}`);
    } finally {
      setLocating(false);
    }
  }, [geo]);

  // "Book this trip again" from trip history arrives with the old addresses.
  const rebooked = useRef(false);
  useEffect(() => {
    const again = location.state?.rebook;
    if (!again || rebooked.current) return;
    rebooked.current = true;
    setPickup(again.pickup);
    setDestination(again.destination);
    getQuote(again.pickup, again.destination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pickup && !location.state?.rebook) locateMe();
    // Only on first mount: later edits to pickup are the rider's.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Long-press / right-click on the map sets the pickup to that spot.
  const pickOnMap = useCallback(
    async ([lng, lat]) => {
      if (phase !== "search") return;
      setPin({ ltd: lat, lng });
      try {
        const { data } = await api.get("/map/reverse", { params: { lat, lng } });
        setPickup(data.address || `${lat},${lng}`);
        toast.info("Pickup set to the pin you dropped.");
      } catch (err) {
        setPickup(`${lat},${lng}`);
        toast.error(getApiErrorMessage(err, "We could not read that spot's address."));
      }
    },
    [phase, toast],
  );

  /* ------------------------------------------------------------- booking */

  const getQuote = useCallback(
    async (from = pickup, to = destination) => {
      const a = from.trim();
      const b = to.trim();
      if (!a || !b) return setError("Enter both a pickup and a destination.");
      if (a.toLowerCase() === b.toLowerCase()) return setError("Pickup and destination are the same place.");
      setBusy(true);
      setError("");
      try {
        const { data } = await api.get("/ride/get-fare", { params: { pickup: a, destination: b } });
        setQuote(data);
      } catch (err) {
        setError(getApiErrorMessage(err, "We could not price this trip."));
      } finally {
        setBusy(false);
      }
    },
    [pickup, destination],
  );

  const requestRide = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/ride/create", {
        pickup: pickup.trim(),
        destination: destination.trim(),
        vehicleType: vehicle,
      });
      setRide(data);
    } catch (err) {
      if (err.code === "ACTIVE_RIDE_EXISTS") refresh();
      setError(getApiErrorMessage(err, "We could not request your ride."));
    } finally {
      setBusy(false);
    }
  };

  const resetBooking = () => {
    setQuote(null);
    setDestination("");
    setError("");
    setActive("destination");
  };

  const cancelRide = async (reason) => {
    setBusy(true);
    try {
      await api.post("/ride/cancel", { rideId: ride._id, ...(reason && { reason }) });
      setCancelOpen(false);
      setRide(null);
      resetBooking();
      toast.info("Your ride was cancelled.");
    } catch (err) {
      setCancelOpen(false);
      toast.error(getApiErrorMessage(err));
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const rebook = () => {
    const previous = ended?.ride;
    dismissEnded();
    if (previous) {
      setPickup(previous.pickup);
      setDestination(previous.destination);
      getQuote(previous.pickup, previous.destination);
    }
  };

  const done = () => {
    dismissEnded();
    resetBooking();
  };

  /* ---------------------------------------------------------- map content */

  const pickupPoint = ride?.pickupCoordinates || quote?.distanceTime?.from || null;
  const destinationPoint = ride?.destinationCoordinates || quote?.distanceTime?.to || null;
  const driver = ride?.captain;
  const driverPoint = useMemo(() => {
    if (!["matched", "ongoing"].includes(phase)) return null;
    if (fix) return { ltd: fix.ltd, lng: fix.lng, heading: fix.heading };
    return driver?.location || null;
  }, [phase, fix, driver?.location]);

  const target = phase === "matched" ? pickupPoint : phase === "ongoing" ? destinationPoint : null;
  const live = useLiveRoute({ from: driverPoint, to: target, enabled: Boolean(driverPoint && target) });
  const preview = useLiveRoute({ from: pickupPoint, to: destinationPoint, enabled: phase === "searching" && !quote });

  const route = ["matched", "ongoing"].includes(phase)
    ? live.geometry
    : phase === "options"
      ? quote?.distanceTime?.geometry
      : phase === "searching"
        ? quote?.distanceTime?.geometry || preview.geometry
        : null;

  const myPoint = useMemo(
    () => (geo.position && phase !== "ongoing" ? { ltd: geo.position.ltd, lng: geo.position.lng } : null),
    [geo.position, phase],
  );
  const markers = useMemo(() => {
    const list = [];
    const showTrip = ["options", "searching", "matched", "ongoing"].includes(phase);
    if (phase === "search" && (pin || myPoint)) list.push({ kind: "me", lngLat: toLngLat(pin || myPoint) });
    if (showTrip && pickupPoint && phase !== "ongoing") list.push({ kind: "pickup", lngLat: toLngLat(pickupPoint) });
    if (showTrip && destinationPoint) list.push({ kind: "destination", lngLat: toLngLat(destinationPoint) });
    if (driverPoint) list.push({ kind: "captain", lngLat: toLngLat(driverPoint), heading: driverPoint.heading });
    return list;
  }, [phase, pin, myPoint, pickupPoint, destinationPoint, driverPoint]);

  const padding = useMemo(() => computeMapPadding({ desktop, sheetHeight }), [desktop, sheetHeight]);
  const fitKey = `${phase}:${ride?._id || ""}:${driverPoint ? "d" : "-"}:${quote ? "q" : "-"}`;
  const eta = live.durationSeconds ?? (phase === "ongoing" ? ride?.duration : null);

  /* --------------------------------------------------------------- panels */

  const firstName = user?.fullname?.firstname;
  const recents = unique((user?.rides || []).slice(0, 12).map((item) => item.destination)).slice(0, 3);
  const nudge = location.state?.suggestTwoFactor && !hideNudge && user?.twoFactorEnabled === false;

  let body = null;
  let footer = null;
  let label = "Book a ride";

  if (phase === "loading") {
    body = <p className="sheet-sub" role="status">Checking for an active trip…</p>;
  } else if (phase === "search") {
    label = "Where to?";
    body = (
      <>
        {nudge && (
          <Banner
            tone="warning"
            action={
              <Button auto size="sm" variant="secondary" to="/user/edit-profile#security" onClick={() => setHideNudge(true)}>
                Set up
              </Button>
            }
          >
            Turn on two-factor sign-in to protect your account.
          </Banner>
        )}
        <PlaceSearchBody
          firstName={firstName}
          pickup={pickup}
          destination={destination}
          setPickup={(value) => {
            setPickup(value);
            setPin(null);
            setError("");
          }}
          setDestination={(value) => {
            setDestination(value);
            setError("");
          }}
          active={active}
          setActive={setActive}
          error={error}
          notice={!pickup && geo.error ? geo.error : ""}
          locating={locating}
          onLocate={locateMe}
          onSwap={() => {
            setPickup(destination);
            setDestination(pickup);
          }}
          onPicked={(field, text) => {
            if (field === "destination" && pickup.trim()) getQuote(pickup, text);
          }}
          savedPlaces={user?.savedPlaces}
          recents={recents}
        />
      </>
    );
    footer = (
      <PlaceSearchFooter
        onSubmit={() => getQuote()}
        loading={busy}
        disabled={!pickup.trim() || !destination.trim()}
      />
    );
  } else if (phase === "options") {
    label = "Choose a ride";
    body = (
      <VehicleOptionsBody
        pickup={pickup}
        destination={destination}
        quote={quote.distanceTime}
        fare={quote.fare}
        selected={vehicle}
        onSelect={setVehicle}
        onBack={() => setQuote(null)}
        error={error}
      />
    );
    footer = (
      <Button onClick={requestRide} loading={busy} loadingText="Requesting" icon={<Navigation size={18} />}>
        Request {vehicle === "car" ? "QuickRide" : vehicle === "bike" ? "QuickBike" : "QuickAuto"} · {money(quote.fare[vehicle])}
      </Button>
    );
  } else if (phase === "searching") {
    label = "Finding your driver";
    body = <SearchingBody ride={ride} />;
    footer = (
      <Button variant="danger" onClick={() => setCancelOpen(true)}>
        Cancel request
      </Button>
    );
  } else if (phase === "matched" || phase === "ongoing") {
    label = phase === "matched" ? "Driver on the way" : "Trip in progress";
    body = (
      <>
        <TripBody
          role="user"
          ride={ride}
          phase={ride.status}
          etaSeconds={eta}
          remainingMeters={live.distanceMeters}
          offline={!online}
        />
        <TripActions
          role="user"
          ride={ride}
          onShare={() => shareTripLink(ride._id, toast)}
          onSafety={() => setSafety(true)}
        />
        <TripDetails ride={ride} />
      </>
    );
    if (phase === "matched") {
      footer = (
        <Button variant="danger" onClick={() => setCancelOpen(true)}>
          Cancel ride
        </Button>
      );
    }
  } else if (phase === "summary") {
    label = "Trip summary";
    body = <SummaryBody role="user" ended={ended} onRebook={rebook} />;
    footer = (
      <Button onClick={done} variant={ended.outcome === "completed" ? "primary" : "secondary"}>
        {ended.outcome === "completed" ? "Done" : "Close"}
      </Button>
    );
  }

  const pill =
    phase === "matched"
      ? { tone: "live", text: eta != null ? `Driver arriving in ${formatDuration(eta)}` : "Driver on the way" }
      : phase === "ongoing"
        ? { tone: "live", text: eta != null ? `${formatDuration(eta)} to drop-off` : "On trip" }
        : phase === "searching"
          ? { tone: "live", text: "Finding your driver" }
          : null;

  return (
    <MapScreen>
      <TripMap
        ref={mapRef}
        markers={markers}
        route={route}
        padding={padding}
        fitKey={fitKey}
        follow={driverPoint ? "captain" : undefined}
        onFollowChange={setFollowing}
        onPick={pickOnMap}
      />

      <MapTopBar
        left={<MapButton icon={<Menu size={21} />} label="Open menu" onClick={() => setDrawer(true)} />}
        center={pill && <StatusPill tone={pill.tone}>{pill.text}</StatusPill>}
        right={
          <>
            {!online && (
              <StatusPill tone="danger" icon={<WifiOff size={16} />}>
                Offline
              </StatusPill>
            )}
            {(phase === "search" || !following) && (
              <MapButton
                icon={<LocateFixed size={20} />}
                label={phase === "search" ? "Use my current location" : "Recenter map"}
                onClick={() => (phase === "search" ? locateMe() : mapRef.current?.recenter())}
              />
            )}
          </>
        }
      />

      <Sheet key={phase} label={label} onHeight={setSheetHeight} footer={footer}>
        {body}
        {phase === "search" && (
          <p className="qr-hint" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={14} aria-hidden="true" /> Every trip is trackable and shareable. Right-click or long-press the map to drop a pickup pin.
          </p>
        )}
      </Sheet>

      <AccountDrawer open={drawer} onClose={() => setDrawer(false)} role="user" account={user} />

      <CancelDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={cancelRide}
        role="user"
        matched={ride?.status === "accepted"}
        loading={busy}
      />
      {ride && (
        <SafetyDialog
          open={safety}
          onClose={() => setSafety(false)}
          role="user"
          ride={ride}
          position={geo.position}
          contacts={user?.emergencyContacts}
          onShare={() => shareTripLink(ride._id, toast)}
        />
      )}
    </MapScreen>
  );
}
