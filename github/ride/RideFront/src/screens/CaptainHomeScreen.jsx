import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { LocateFixed, Menu, Navigation, Phone, ShieldCheck, User } from "lucide-react";
import api, { getApiErrorMessage } from "../utils/api";
import { useCaptain } from "../contexts/CaptainContext";
import { SocketDataContext } from "../contexts/SocketContext";
import { Alert, NewRide, Sidebar } from "../components";
import TripMap from "../components/TripMap";
import useMapPadding from "../hooks/useMapPadding";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import "./UserHomeScreen.css";
import "./CaptainHomeScreen.css";

const defaultRideData = {
  user: {
    fullname: {
      firstname: "No",
      lastname: "User",
    },
    _id: "",
    email: "example@gmail.com",
    rides: [],
  },
  pickup: "Place, City, State, Country",
  destination: "Place, City, State, Country",
  fare: 0,
  vehicle: "car",
  status: "pending",
  duration: 0,
  distance: 0,
  _id: "123456789012345678901234",
};

const readStored = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

function CaptainHomeScreen() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { captain } = useCaptain();
  const { socket } = useContext(SocketDataContext);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  const mapPadding = useMapPadding();

  const [position, setPosition] = useState(null); // { ltd, lng }
  const [route, setRoute] = useState(null);
  const [rideMarkers, setRideMarkers] = useState({});
  const [earnings, setEarnings] = useState({ total: 0, today: 0 });
  const [rides, setRides] = useState({ accepted: 0, cancelled: 0, distanceTravelled: 0 });
  const [newRide, setNewRide] = useState(() => readStored("rideDetails", defaultRideData));
  const [otp, setOtp] = useState("");
  const [messages, setMessages] = useState(() => readStored("messages", []));
  const [error, setError] = useState("");

  // Panels
  const [showCaptainDetailsPanel, setShowCaptainDetailsPanel] = useState(true);
  const [showNewRidePanel, setShowNewRidePanel] = useState(() => readStored("showPanel", false));
  const [showBtn, setShowBtn] = useState(() => readStored("showBtn", "accept"));

  const positionRef = useRef(position);
  positionRef.current = position;

  // Draws origin -> destination and drops the matching markers. Failures only lose the
  // overlay, never the ride flow, so they are swallowed after logging.
  const showRoute = useCallback(async (origin, destination) => {
    try {
      const { data } = await api.get("/map/route", { params: { origin, destination } });
      setRoute(data.geometry || null);
      setRideMarkers({
        pickup: [data.from.lng, data.from.ltd],
        destination: [data.to.lng, data.to.ltd],
      });
    } catch (err) {
      Console.error(err);
    }
  }, []);

  const clearMapOverlay = () => {
    setRoute(null);
    setRideMarkers({});
  };

  const coordsOrNull = () =>
    positionRef.current ? `${positionRef.current.ltd},${positionRef.current.lng}` : null;

  const acceptRide = async () => {
    try {
      if (newRide._id != "") {
        setLoading(true);
        const response = await api.post("/ride/confirm", { rideId: newRide._id });
        setLoading(false);
        setShowBtn("otp");
        // The dispatch broadcast omits the rider's phone/socketId until accepted (see
        // ride-service hardening); the confirm response is where that first appears.
        setNewRide(response.data);
        const here = coordsOrNull();
        if (here) showRoute(here, newRide.pickup);
        Console.log(response);
      }
    } catch (error) {
      setLoading(false);
      showAlert("Some error occured", getApiErrorMessage(error), "failure");
      Console.log(error.response);
      setTimeout(() => {
        clearRideData();
      }, 1000);
    }
  };

  const verifyOTP = async () => {
    try {
      if (newRide._id != "" && otp.length == 6) {
        setLoading(true);
        setError("");
        const response = await api.post("/ride/start-ride", { rideId: newRide._id, otp });
        showRoute(newRide.pickup, newRide.destination);
        setShowBtn("end-ride");
        setLoading(false);
        Console.log(response);
      }
    } catch (err) {
      setLoading(false);
      setError(getApiErrorMessage(err, "Invalid OTP"));
      Console.log(err);
    }
  };

  const endRide = async () => {
    try {
      if (newRide._id != "") {
        setLoading(true);
        await api.post("/ride/end-ride", { rideId: newRide._id });
        clearRideData();
      }
    } catch (err) {
      setLoading(false);
      Console.log(err);
    }
  };

  const updateLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { ltd: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(next);
        socket.emit("update-location-captain", { location: next });
      },
      (err) => Console.error("Error fetching position:", err),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, [socket]);

  function clearRideData() {
    setShowBtn("accept");
    setLoading(false);
    setOtp("");
    setError("");
    setShowCaptainDetailsPanel(true);
    setShowNewRidePanel(false);
    setNewRide(defaultRideData);
    clearMapOverlay();
    localStorage.removeItem("rideDetails");
    localStorage.removeItem("showPanel");
  }

  useEffect(() => {
    if (!captain?._id) return undefined;
    socket.emit("join", { userId: captain._id, userType: "captain" });
    updateLocation();

    const onNewRide = (data) => {
      Console.log("New Ride available:", data);
      setShowBtn("accept");
      setNewRide(data);
      setShowNewRidePanel(true);
      showRoute(data.pickup, data.destination);
    };
    const onRideCancelled = (data) => {
      Console.log("Ride cancelled", data);
      updateLocation();
      clearRideData();
    };
    socket.on("new-ride", onNewRide);
    socket.on("ride-cancelled", onRideCancelled);
    return () => {
      socket.off("new-ride", onNewRide);
      socket.off("ride-cancelled", onRideCancelled);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captain?._id, socket]);

  // While a ride is underway, stream GPS so the rider sees the driver move.
  const tracking = showNewRidePanel && showBtn !== "accept";
  useEffect(() => {
    if (!tracking || !navigator.geolocation) return undefined;
    let last = 0;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const next = { ltd: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(next);
        if (Date.now() - last > 1500) {
          last = Date.now();
          socket.emit("update-location-captain", { location: next });
        }
      },
      (err) => Console.error("Position watch failed:", err),
      { enableHighAccuracy: true, maximumAge: 2000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [tracking, socket]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    socket.emit("join-room", newRide._id);
    const onReceiveMessage = (msg) => setMessages((prev) => [...prev, { msg, by: "other" }]);
    socket.on("receiveMessage", onReceiveMessage);
    return () => socket.off("receiveMessage", onReceiveMessage);
  }, [newRide._id, socket]);

  useEffect(() => {
    localStorage.setItem("rideDetails", JSON.stringify(newRide));
  }, [newRide]);

  useEffect(() => {
    localStorage.setItem("showPanel", JSON.stringify(showNewRidePanel));
    localStorage.setItem("showBtn", JSON.stringify(showBtn));
  }, [showNewRidePanel, showBtn]);

  useEffect(() => {
    if (!captain?.rides) return;
    let total = 0;
    let today = 0;
    let accepted = 0;
    let cancelled = 0;
    let distance = 0;
    const startOfToday = new Date().setHours(0, 0, 0, 0);

    captain.rides.forEach((ride) => {
      if (ride.status == "completed") {
        accepted++;
        distance += ride.distance;
      }
      if (ride.status == "cancelled") cancelled++;
      total += ride.fare;
      if (ride.status === "completed" && new Date(ride.updatedAt).setHours(0, 0, 0, 0) === startOfToday) {
        today += ride.fare;
      }
    });

    setEarnings({ total, today });
    setRides({ accepted, cancelled, distanceTravelled: Math.round(distance / 1000) });
  }, [captain]);

  const markers = [
    ...(position ? [{ kind: "me", lngLat: [position.lng, position.ltd] }] : []),
    ...Object.entries(rideMarkers).map(([kind, lngLat]) => ({ kind, lngLat })),
  ];
  // Without a route, keep the camera on the driver.
  const mapMarkers = route ? markers : markers.filter((m) => m.kind === "me");
  const initials = `${captain?.fullname?.firstname?.[0] || ""}${captain?.fullname?.lastname?.[0] || ""}`;

  return (
    <div className="ride-booking-shell relative w-full h-dvh">
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <TripMap markers={mapMarkers} route={route} padding={mapPadding} />

      <header className="ride-map-header">
        <button
          className="ride-location-button"
          type="button"
          onClick={() => setShowSidebar(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
          <span>Menu</span>
        </button>
        <button
          className="ride-location-button"
          type="button"
          onClick={updateLocation}
          aria-label="Update my location"
        >
          <LocateFixed size={17} />
          <span>Locate me</span>
        </button>
      </header>
      <div className="ride-map-trust" aria-label="QuickRide status">
        <ShieldCheck size={15} />
        <span>{tracking ? "Sharing live location" : "You're online"}</span>
      </div>

      {showCaptainDetailsPanel && !showNewRidePanel && (
        <section className="booking-panel captain-panel" aria-label="Driver dashboard">
          <div className="booking-panel-heading">
            <div>
              <span className="booking-eyebrow">DRIVER DASHBOARD</span>
              <h1>Ready for rides</h1>
            </div>
            <span className="captain-status"><span aria-hidden="true" />Online</span>
          </div>

          <div className="captain-profile">
            <button
              type="button"
              className="captain-avatar"
              onClick={() => setShowSidebar(true)}
              aria-label="Open profile"
            >
              {initials}
            </button>
            <div>
              <strong>
                {captain?.fullname?.firstname} {captain?.fullname?.lastname}
              </strong>
              <span><Phone size={12} />{captain?.phone}</span>
            </div>
          </div>

          <div className="captain-earnings">
            <div>
              <span>Today</span>
              <strong>${earnings.today.toFixed(2)}</strong>
            </div>
            <div>
              <span>Total earned</span>
              <strong>${earnings.total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="captain-stats">
            <div><strong>{rides.accepted}</strong><span>Completed</span></div>
            <div><strong>{rides.distanceTravelled}</strong><span>Km driven</span></div>
            <div><strong>{rides.cancelled}</strong><span>Cancelled</span></div>
          </div>

          <div className="captain-vehicle">
            <div>
              <strong>{captain?.vehicle?.number}</strong>
              <span>
                {captain?.vehicle?.color} · <User size={12} /> {captain?.vehicle?.capacity}
              </span>
            </div>
            {captain?.vehicle?.type && (
              <img
                src={captain.vehicle.type == "car" ? "/car.png" : `/${captain.vehicle.type}.webp`}
                alt={`${captain.vehicle.type} vehicle`}
              />
            )}
          </div>

          <p className="booking-footnote">
            <Navigation size={11} style={{ display: "inline", marginRight: 4 }} />
            New ride requests appear here instantly.
          </p>
        </section>
      )}

      <NewRide
        rideData={newRide}
        otp={otp}
        setOtp={setOtp}
        showBtn={showBtn}
        showPanel={showNewRidePanel}
        setShowPanel={setShowNewRidePanel}
        showPreviousPanel={(show) => {
          setShowCaptainDetailsPanel(show);
          clearMapOverlay();
        }}
        loading={loading}
        acceptRide={acceptRide}
        verifyOTP={verifyOTP}
        endRide={endRide}
        error={error}
      />
    </div>
  );
}

export default CaptainHomeScreen;
