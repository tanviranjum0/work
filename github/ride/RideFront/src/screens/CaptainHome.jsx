import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Check, LocateFixed, Menu, WifiOff, X } from "lucide-react";
import api, { getApiErrorMessage } from "../utils/api";
import { useCaptain } from "../contexts/CaptainContext";
import { SocketDataContext } from "../contexts/SocketContext";
import useRideSession from "../hooks/useRideSession";
import useGeolocation from "../hooks/useGeolocation";
import useLiveRoute from "../hooks/useLiveRoute";
import useWakeLock from "../hooks/useWakeLock";
import { useIsDesktop, useOnlineStatus } from "../hooks/useViewport";
import { Button, ConfirmDialog, useToast } from "../components/ui";
import AccountDrawer from "../components/AccountDrawer";
import TripMap from "../components/map/TripMap";
import { MapButton, MapScreen, MapTopBar, Sheet, StatusPill, computeMapPadding } from "../components/map/MapScreen";
import { DashboardBody, OfferBody, PickupBody, PickupCodeEntry } from "../components/ride/CaptainPanels";
import { CancelDialog, SafetyDialog, SummaryBody, TripActions, TripBody, TripDetails } from "../components/ride/RideTrip";
import { askNotificationPermission } from "../utils/alerts";
import { formatDuration, money } from "../utils/format";
import { toLngLat } from "../utils/geo";

const IDLE_EMIT_MS = 8000;
const TRIP_EMIT_MS = 1500;

export default function CaptainHome() {
  const toast = useToast();
  const desktop = useIsDesktop();
  const networkOnline = useOnlineStatus();
  const { socket } = useContext(SocketDataContext);
  const { captain, setCaptain } = useCaptain();
  const { ride, setRide, ended, setEnded, dismissEnded, offers, dropOffer, clearOffers, loadOffers, refresh } =
    useRideSession("captain");
  const mapRef = useRef(null);

  const [online, setOnline] = useState(captain?.status === "active");
  const [toggling, setToggling] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [following, setFollowing] = useState(true);
  const [focusedOffer, setFocusedOffer] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [busy, setBusy] = useState(false);
  const [safety, setSafety] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const hasRide = Boolean(ride);
  const trackingNeeded = online || hasRide;

  /* ----------------------------------------------------- location streaming */

  const lastEmit = useRef(0);
  const hasRideRef = useRef(hasRide);
  hasRideRef.current = hasRide;
  const emitFix = useCallback(
    (fix) => {
      const every = hasRideRef.current ? TRIP_EMIT_MS : IDLE_EMIT_MS;
      if (Date.now() - lastEmit.current < every || !socket.connected) return;
      lastEmit.current = Date.now();
      socket.emit("update-location-captain", {
        location: { ltd: fix.ltd, lng: fix.lng },
        heading: fix.heading,
        speed: fix.speed,
      });
    },
    [socket],
  );
  const geo = useGeolocation({ watch: trackingNeeded, onFix: emitFix });
  useWakeLock(hasRide);

  // One location fix on open, so the map starts on the driver even while offline.
  useEffect(() => {
    geo.locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEarnings = useCallback(async () => {
    try {
      const { data } = await api.get("/captain/earnings");
      setEarnings(data.earnings);
    } catch {
      /* the dashboard still works without totals */
    }
  }, []);

  useEffect(() => {
    loadEarnings();
  }, [loadEarnings]);

  useEffect(() => {
    if (online && !hasRide) loadOffers();
  }, [online, hasRide, loadOffers]);

  /* --------------------------------------------------------- online status */

  const goOnline = async () => {
    setToggling(true);
    try {
      const here = await geo.locate();
      if (!here) {
        toast.error("Turn on location access to go online, so riders near you can be matched.");
        return;
      }
      await api.patch("/captain/status", { status: "active" });
      emitFix({ ...here, heading: here.heading });
      setOnline(true);
      setCaptain((current) => ({ ...current, status: "active" }));
      askNotificationPermission();
      toast.success("You are online. Requests will appear here.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "We could not take you online."));
    } finally {
      setToggling(false);
    }
  };

  const goOffline = async () => {
    setToggling(true);
    try {
      await api.patch("/captain/status", { status: "inactive" });
      setOnline(false);
      clearOffers();
      setCaptain((current) => ({ ...current, status: "inactive" }));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setToggling(false);
    }
  };

  /* ---------------------------------------------------------------- actions */

  const accept = async (offer) => {
    setBusy(true);
    try {
      const { data } = await api.post("/ride/confirm", { rideId: offer._id });
      setRide(data);
      clearOffers();
      setFocusedOffer(null);
      setOtp("");
      setOtpError("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "We could not accept this ride."));
      if (error.code === "RIDE_UNAVAILABLE" || error.response?.status === 404) dropOffer(offer._id);
    } finally {
      setBusy(false);
    }
  };

  const decline = (offer) => {
    dropOffer(offer._id);
    setFocusedOffer(null);
  };

  const startTrip = async (code = otp) => {
    if (code.length !== 6 || busy) return;
    setBusy(true);
    setOtpError("");
    try {
      const { data } = await api.post("/ride/start-ride", { rideId: ride._id, otp: code });
      setRide(data);
      setOtp("");
    } catch (error) {
      setOtpError(getApiErrorMessage(error, "That code did not work."));
      setOtp("");
    } finally {
      setBusy(false);
    }
  };

  const endTrip = async () => {
    setBusy(true);
    try {
      const { data } = await api.post("/ride/end-ride", { rideId: ride._id });
      setEndOpen(false);
      setRide(null);
      setEnded({ ride: data, outcome: "completed" });
      loadEarnings();
    } catch (error) {
      setEndOpen(false);
      toast.error(getApiErrorMessage(error));
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const cancelTrip = async (reason) => {
    setBusy(true);
    try {
      await api.post("/ride/cancel", { rideId: ride._id, ...(reason && { reason }) });
      setCancelOpen(false);
      setRide(null);
      toast.info("You cancelled this ride.");
      loadEarnings();
    } catch (error) {
      setCancelOpen(false);
      toast.error(getApiErrorMessage(error));
      refresh();
    } finally {
      setBusy(false);
    }
  };

  /* -------------------------------------------------------------- derived UI */

  const activeOffer = !hasRide && !ended ? offers.find((offer) => offer._id === focusedOffer) || offers[0] : null;
  const phase = ended
    ? "summary"
    : ride === undefined
      ? "loading"
      : ride
        ? ride.status === "accepted" ? "pickup" : "trip"
        : activeOffer
          ? "offer"
          : "dashboard";

  const myPoint = useMemo(
    () => (geo.position ? { ltd: geo.position.ltd, lng: geo.position.lng, heading: geo.position.heading } : null),
    [geo.position],
  );
  const pickupPoint = ride?.pickupCoordinates || activeOffer?.pickupCoordinates || null;
  const destinationPoint = ride?.destinationCoordinates || activeOffer?.destinationCoordinates || null;
  const legTarget = phase === "pickup" ? pickupPoint : phase === "trip" ? destinationPoint : null;
  const live = useLiveRoute({ from: myPoint, to: legTarget, enabled: Boolean(myPoint && legTarget) });
  const offerRoute = useLiveRoute({ from: pickupPoint, to: destinationPoint, enabled: phase === "offer" });

  const route = phase === "offer" ? offerRoute.geometry : ["pickup", "trip"].includes(phase) ? live.geometry : null;
  const markers = useMemo(() => {
    const list = [];
    if (myPoint) list.push({ kind: "captain", lngLat: toLngLat(myPoint), heading: myPoint.heading });
    if (["offer", "pickup"].includes(phase) && pickupPoint) list.push({ kind: "pickup", lngLat: toLngLat(pickupPoint) });
    if (["offer", "pickup", "trip"].includes(phase) && destinationPoint) list.push({ kind: "destination", lngLat: toLngLat(destinationPoint) });
    return list;
  }, [myPoint, phase, pickupPoint, destinationPoint]);

  const padding = useMemo(() => computeMapPadding({ desktop, sheetHeight }), [desktop, sheetHeight]);
  const fitKey = `${phase}:${ride?._id || ""}:${activeOffer?._id || ""}:${myPoint ? "m" : "-"}`;
  const eta = live.durationSeconds;

  let body = null;
  let footer = null;
  let label = "Driver dashboard";

  if (phase === "loading") {
    body = <p className="sheet-sub" role="status">Loading your trip…</p>;
  } else if (phase === "dashboard") {
    body = (
      <DashboardBody
        captain={captain}
        online={online}
        onToggle={online ? goOffline : goOnline}
        toggling={toggling}
        earnings={earnings}
        loadingEarnings={!earnings}
        offers={offers}
        onOpenOffer={(offer) => setFocusedOffer(offer._id)}
        locationError={online ? geo.error : ""}
      />
    );
  } else if (phase === "offer") {
    label = "New ride request";
    body = <OfferBody offer={activeOffer} eta={null} />;
    footer = (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
        <Button variant="secondary" icon={<X size={18} />} onClick={() => decline(activeOffer)} disabled={busy}>
          Decline
        </Button>
        <Button icon={<Check size={18} />} onClick={() => accept(activeOffer)} loading={busy} loadingText="Accepting">
          Accept · {money(activeOffer.fare)}
        </Button>
      </div>
    );
  } else if (phase === "pickup" || phase === "trip") {
    label = phase === "pickup" ? "Head to pickup" : "Trip in progress";
    body = (
      <>
        <TripBody role="captain" ride={ride} phase={ride.status} etaSeconds={eta} remainingMeters={live.distanceMeters} offline={!networkOnline} />
        <TripActions
          role="captain"
          ride={ride}
          onShare={() => {
            navigator.clipboard?.writeText(ride.pickup).then(() => toast.success("Pickup address copied"));
          }}
          onSafety={() => setSafety(true)}
        />
        {phase === "pickup" ? (
          <>
            <PickupBody ride={ride} />
            <Button variant="danger" size="sm" onClick={() => setCancelOpen(true)}>
              Cancel this ride
            </Button>
          </>
        ) : (
          <TripDetails ride={ride} />
        )}
      </>
    );
    footer =
      phase === "pickup" ? (
        <>
          <PickupCodeEntry otp={otp} setOtp={setOtp} error={otpError} onSubmit={startTrip} />
          <Button onClick={() => startTrip()} loading={busy} loadingText="Starting" disabled={otp.length !== 6}>
            Start trip
          </Button>
        </>
      ) : (
        <Button onClick={() => setEndOpen(true)} variant="dark">
          End trip
        </Button>
      );
  } else if (phase === "summary") {
    label = "Trip summary";
    body = <SummaryBody role="captain" ended={ended} />;
    footer = (
      <Button
        onClick={() => {
          dismissEnded();
          loadEarnings();
        }}
      >
        Back to dashboard
      </Button>
    );
  }

  const pill =
    phase === "pickup"
      ? { tone: "live", text: eta != null ? `${formatDuration(eta)} to pickup` : "Head to pickup" }
      : phase === "trip"
        ? { tone: "live", text: eta != null ? `${formatDuration(eta)} to drop-off` : "Trip in progress" }
        : phase === "offer"
          ? { tone: "live", text: "New ride request" }
          : { tone: online ? "live" : "offline", text: online ? "Online" : "Offline" };

  return (
    <MapScreen>
      <TripMap
        ref={mapRef}
        markers={markers}
        route={route}
        padding={padding}
        fitKey={fitKey}
        follow={hasRide ? "captain" : undefined}
        onFollowChange={setFollowing}
      />

      <MapTopBar
        left={<MapButton icon={<Menu size={21} />} label="Open menu" onClick={() => setDrawer(true)} />}
        center={<StatusPill tone={pill.tone}>{pill.text}</StatusPill>}
        right={
          <>
            {!networkOnline && (
              <StatusPill tone="danger" icon={<WifiOff size={16} />}>
                Offline
              </StatusPill>
            )}
            <MapButton
              icon={<LocateFixed size={20} />}
              label="Centre on my location"
              onClick={() => (following ? geo.locate() : mapRef.current?.recenter())}
            />
          </>
        }
      />

      <Sheet key={`${phase}:${activeOffer?._id || ""}`} label={label} onHeight={setSheetHeight} footer={footer}>
        {body}
      </Sheet>

      <AccountDrawer open={drawer} onClose={() => setDrawer(false)} role="captain" account={captain} />

      <CancelDialog open={cancelOpen} onClose={() => setCancelOpen(false)} onConfirm={cancelTrip} role="captain" matched loading={busy} />
      <ConfirmDialog
        open={endOpen}
        onClose={() => setEndOpen(false)}
        onConfirm={endTrip}
        loading={busy}
        title="End this trip?"
        confirmLabel="End trip"
        cancelLabel="Not yet"
        placement="bottom"
      >
        Only end the trip once the rider has reached their drop-off. Collect {money(ride?.fare)} in cash.
      </ConfirmDialog>
      {ride && (
        <SafetyDialog open={safety} onClose={() => setSafety(false)} role="captain" ride={ride} position={geo.position} />
      )}
    </MapScreen>
  );
}
