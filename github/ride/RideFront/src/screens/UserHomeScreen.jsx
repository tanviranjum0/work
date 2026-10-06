import { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LocateFixed, MapPin, ShieldCheck } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import {
  Button,
  LocationSuggestions,
  SelectVehicle,
  RideDetails,
} from "../components";
import TripMap from "../components/TripMap";
import useMapPadding from "../hooks/useMapPadding";
import api from "../utils/api";
import debounce from "lodash.debounce";
import { SocketDataContext } from "../contexts/SocketContext";
import Console from "../utils/console";
import "./UserHomeScreen.css";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

function UserHomeScreen() {
  const { socket } = useContext(SocketDataContext);
  const { user } = useUser();
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || []
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedInput, setSelectedInput] = useState("pickup");
  const [locationSuggestion, setLocationSuggestion] = useState([]);
  // Interactive map state: markers keyed by kind, plus the drawn route geometry.
  const [markers, setMarkers] = useState({});
  const [route, setRoute] = useState(null);
  const mapPadding = useMapPadding();
  const setMarker = (kind, lngLat) =>
    setMarkers((prev) => {
      const next = { ...prev };
      if (lngLat) next[kind] = lngLat;
      else delete next[kind];
      return next;
    });
  const [rideCreated, setRideCreated] = useState(false);

  // Ride details
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("car");
  const [fare, setFare] = useState({
    auto: 0,
    car: 0,
    bike: 0,
  });
  const [confirmedRideData, setConfirmedRideData] = useState(null);
  // The OTP only comes back once, in POST /ride/create's response, well before a captain
  // accepts; it's carried here so it can be attached to the ride-confirmed payload later.
  const [rideOtp, setRideOtp] = useState(null);
  const rideTimeout = useRef(null);
  const pickupLocationRef = useRef(pickupLocation);
  pickupLocationRef.current = pickupLocation;
  const rideOtpRef = useRef(rideOtp);
  rideOtpRef.current = rideOtp;
  const locationChangeHandler = useRef(null);

  // Panels
  const [showFindTripPanel, setShowFindTripPanel] = useState(true);
  const [showSelectVehiclePanel, setShowSelectVehiclePanel] = useState(false);
  const [showRideDetailsPanel, setShowRideDetailsPanel] = useState(false);

  if (!locationChangeHandler.current) {
    locationChangeHandler.current = debounce(async (inputValue) => {
      if (inputValue.length >= 3) {
        try {
          const response = await api.get("/map/get-suggestions", {
            params: { input: inputValue },
          });
          setLocationSuggestion(response.data);
        } catch (error) {
          Console.error(error);
          setErrorMessage(
            getErrorMessage(error, "We couldn't load location suggestions.")
          );
        }
      }
    }, 700);
  }

  const onChangeHandler = (e) => {
    setSelectedInput(e.target.id);
    const value = e.target.value;
    setErrorMessage("");
    if (e.target.id === "pickup") {
      setPickupLocation(value);
    } else if (e.target.id === "destination") {
      setDestinationLocation(value);
    }

    if (import.meta.env.VITE_ENVIRONMENT === "production") {
      locationChangeHandler.current(value);
    }

    if (e.target.value.length < 3) {
      setLocationSuggestion([]);
    }
  };

  const getDistanceAndFare = async (pickupLocation, destinationLocation) => {
    const pickup = pickupLocation.trim();
    const destination = destinationLocation.trim();
    if (!pickup || !destination) {
      setErrorMessage("Enter both a pickup and destination to see your fare.");
      return;
    }
    if (pickup.toLocaleLowerCase() === destination.toLocaleLowerCase()) {
      setErrorMessage("Choose two different locations for your trip.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      const response = await api.get("/ride/get-fare", {
        params: { pickup, destination },
      });
      setFare(response.data.fare);
      const { geometry, from, to } = response.data.distanceTime || {};
      setRoute(geometry || null);
      if (from && to) {
        setMarker("pickup", [from.lng, from.ltd]);
        setMarker("destination", [to.lng, to.ltd]);
      }

      setShowFindTripPanel(false);
      setShowSelectVehiclePanel(true);
      setLocationSuggestion([]);
    } catch (error) {
      Console.error(error);
      setErrorMessage(getErrorMessage(error, "We couldn't calculate your fare."));
    } finally {
      setLoading(false);
    }
  };

  const createRide = async () => {
    if (!pickupLocation.trim() || !destinationLocation.trim()) {
      setErrorMessage("Add your pickup and destination before requesting a ride.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      const response = await api.post("/ride/create", {
        pickup: pickupLocation,
        destination: destinationLocation,
        vehicleType: selectedVehicle,
      });
      setRideOtp(response.data.otp);
      const rideData = {
        pickup: pickupLocation,
        destination: destinationLocation,
        vehicleType: selectedVehicle,
        fare: fare,
        confirmedRideData: confirmedRideData,
        otp: response.data.otp,
        _id: response.data._id,
      };
      localStorage.setItem("rideDetails", JSON.stringify(rideData));
      setLoading(false);
      setRideCreated(true);

      clearTimeout(rideTimeout.current);
      rideTimeout.current = setTimeout(() => {
        cancelRide();
      }, Number(import.meta.env.VITE_RIDE_TIMEOUT) || 90000);

    } catch (error) {
      Console.error(error);
      setErrorMessage(getErrorMessage(error, "Your ride couldn't be requested."));
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async () => {
    const rideDetails = JSON.parse(localStorage.getItem("rideDetails") || "null");
    const rideId = rideDetails?._id || rideDetails?.confirmedRideData?._id;
    if (!rideId) {
      setErrorMessage("We couldn't find this ride. Please refresh and try again.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      await api.post("/ride/cancel", { rideId });
      clearTimeout(rideTimeout.current);
      updateLocation();
      setShowRideDetailsPanel(false);
      setShowSelectVehiclePanel(false);
      setShowFindTripPanel(true);
      setDefaults();
      localStorage.removeItem("rideDetails");
      localStorage.removeItem("panelDetails");
      localStorage.removeItem("messages");
      localStorage.removeItem("showPanel");
      localStorage.removeItem("showBtn");
    } catch (error) {
      Console.error(error);
      setErrorMessage(getErrorMessage(error, "We couldn't cancel this ride."));
    } finally {
      setLoading(false);
    }
  };
  // Set ride details to default values
  const setDefaults = () => {
    setRoute(null);
    setMarkers((prev) => (prev.me ? { me: prev.me } : {}));
    setPickupLocation("");
    setDestinationLocation("");
    setSelectedVehicle("car");
    setFare({
      auto: 0,
      car: 0,
      bike: 0,
    });
    setConfirmedRideData(null);
    setRideCreated(false);
    setRideOtp(null);
  };

  // Update Location


  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setRoute(null);
          setMarkers({ me: [longitude, latitude] });
          try {
            const { data } = await api.get("/map/reverse", {
              params: { lat: latitude, lng: longitude },
            });
            if (data.address) setPickupLocation(data.address);
          } catch (error) {
            Console.error(error);
          }
        },

        (error) => {
          Console.error("Unable to get the current location:", error);
          setErrorMessage(
            error.code === error.PERMISSION_DENIED
              ? "Location access is off. Enter your pickup address to continue."
              : "We couldn't find your location. Enter your pickup address instead."
          );
        }
      );
    } else {
      setErrorMessage("Location isn't available in this browser. Enter your pickup address.");
    }
  };

  // Long-press / right-click on the map sets the pickup to that spot.
  const pickOnMap = async ([lng, lat]) => {
    if (!showFindTripPanel) return;
    setMarkers((prev) => ({ ...prev, me: [lng, lat] }));
    try {
      const { data } = await api.get("/map/reverse", { params: { lat, lng } });
      if (data.address) setPickupLocation(data.address);
    } catch (error) {
      Console.error(error);
      setErrorMessage("We couldn't read that spot. Type the pickup address instead.");
    }
  };

  // Update Location
  useEffect(() => {
    updateLocation();
  }, []);

  useEffect(() => () => locationChangeHandler.current.cancel(), []);

  useEffect(
    () => () => clearTimeout(rideTimeout.current),
    []
  );

  // Socket Events
  useEffect(() => {
    if (user._id) {
      socket.emit("join", {
        userId: user._id,
        userType: "user",
      });
    }
  }, [socket, user?._id]);

  useEffect(() => {
    const onRideConfirmed = (data) => {
      clearTimeout(rideTimeout.current);
      const [longitude, latitude] =
        data.captain?.location?.coordinates || [];
      if (latitude != null && longitude != null) {
        setMarker("captain", [longitude, latitude]);
      }
      setConfirmedRideData({ ...data, otp: rideOtpRef.current });
      setErrorMessage("");
    };

    const onRideStarted = () => {
      setMarker("captain", null);
    };

    const onCaptainLocation = ({ ltd, lng }) => setMarker("captain", [lng, ltd]);

    const onRideEnded = () => {
      setShowRideDetailsPanel(false);
      setShowSelectVehiclePanel(false);
      setShowFindTripPanel(true);
      setDefaults();
      clearTimeout(rideTimeout.current);
      localStorage.removeItem("rideDetails");
      localStorage.removeItem("panelDetails");
    };

    socket.on("ride-confirmed", onRideConfirmed);
    socket.on("ride-started", onRideStarted);
    socket.on("ride-ended", onRideEnded);
    socket.on("captain-location", onCaptainLocation);
    return () => {
      socket.off("captain-location", onCaptainLocation);
      socket.off("ride-confirmed", onRideConfirmed);
      socket.off("ride-started", onRideStarted);
      socket.off("ride-ended", onRideEnded);
    };
  }, [socket]);

  // Get ride details
  useEffect(() => {
    const storedRideDetails = localStorage.getItem("rideDetails");
    const storedPanelDetails = localStorage.getItem("panelDetails");

    if (storedRideDetails) {
      const ride = JSON.parse(storedRideDetails);
      setPickupLocation(ride.pickup);
      setDestinationLocation(ride.destination);
      setSelectedVehicle(ride.vehicleType);
      setFare(ride.fare);
      setConfirmedRideData(ride.confirmedRideData);
      if (ride.otp) setRideOtp(ride.otp);
    }

    if (storedPanelDetails) {
      const panels = JSON.parse(storedPanelDetails);
      setShowFindTripPanel(panels.showFindTripPanel);
      setShowSelectVehiclePanel(panels.showSelectVehiclePanel);
      setShowRideDetailsPanel(panels.showRideDetailsPanel);
    }
  }, []);

  // Store Ride Details
  useEffect(() => {
    const rideData = {
      pickup: pickupLocation,
      destination: destinationLocation,
      vehicleType: selectedVehicle,
      fare: fare,
      confirmedRideData: confirmedRideData,
      otp: rideOtp,
    };
    localStorage.setItem("rideDetails", JSON.stringify(rideData));
  }, [
    pickupLocation,
    destinationLocation,
    selectedVehicle,
    fare,
    confirmedRideData,
    rideOtp,
  ]);

  // Store panel information
  useEffect(() => {
    const panelDetails = {
      showFindTripPanel,
      showSelectVehiclePanel,
      showRideDetailsPanel,
    };
    localStorage.setItem("panelDetails", JSON.stringify(panelDetails));
  }, [showFindTripPanel, showSelectVehiclePanel, showRideDetailsPanel]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    socket.emit("join-room", confirmedRideData?._id);

    const onReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, { msg, by: "other" }]);
    };
    socket.on("receiveMessage", onReceiveMessage);

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
    };
  }, [socket, confirmedRideData?._id]);

  return (
    <div className="ride-booking-shell relative w-full h-dvh">
      <TripMap
        markers={Object.entries(markers).map(([kind, lngLat]) => ({ kind, lngLat }))}
        route={route}
        padding={mapPadding}
        onPick={pickOnMap}
      />
      <header className="ride-map-header">
        <div className="ride-brand">
          <span className="ride-brand-mark"><MapPin size={19} /></span>
          <span>quickride<span className="ride-brand-period">.</span></span>
        </div>
        <button
          className="ride-location-button"
          type="button"
          onClick={updateLocation}
          aria-label="Use my current location"
        >
          <LocateFixed size={17} />
          <span>Locate me</span>
        </button>
      </header>
      <div className="ride-map-trust" aria-label="QuickRide safety promise">
        <ShieldCheck size={15} />
        <span>Every ride, a safer ride</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {showFindTripPanel ? (
          <motion.div
            key="find-ride"
            className="booking-panel booking-search-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="booking-panel-heading">
              <div>
                <span className="booking-eyebrow">YOUR CITY, YOUR WAY</span>
                <h1>Where to?</h1>
              </div>
              <span className="booking-step">01 <span>/ 03</span></span>
            </div>
            <div className="booking-location-fields">
              <span className="booking-route-line" aria-hidden="true" />
              <span className="booking-route-dot booking-route-dot-pickup" aria-hidden="true" />
              <span className="booking-route-dot booking-route-dot-destination" aria-hidden="true" />
              <input
                id="pickup"
                aria-label="Pickup location"
                aria-autocomplete="list"
                aria-controls="location-suggestions"
                aria-expanded={selectedInput === "pickup" && locationSuggestion.length > 0}
                placeholder="Pickup location"
                className="booking-location-input"
                value={pickupLocation}
                onFocus={() => setSelectedInput("pickup")}
                onChange={onChangeHandler}
                autoComplete="off"
              />
              <input
                id="destination"
                aria-label="Destination"
                aria-autocomplete="list"
                aria-controls="location-suggestions"
                aria-expanded={selectedInput === "destination" && locationSuggestion.length > 0}
                placeholder="Where are you going?"
                className="booking-location-input"
                value={destinationLocation}
                onFocus={() => setSelectedInput("destination")}
                onChange={onChangeHandler}
                autoComplete="off"
              />
            </div>
            {errorMessage && (
              <p className="booking-error" role="alert">{errorMessage}</p>
            )}
            <div className="booking-suggestions">
              {locationSuggestion.length > 0 && (
                <LocationSuggestions
                  suggestions={locationSuggestion}
                  setSuggestions={setLocationSuggestion}
                  setPickupLocation={setPickupLocation}
                  setDestinationLocation={setDestinationLocation}
                  input={selectedInput}
                />
              )}
            </div>
            <Button
              title="See ride options"
              loading={loading}
              disabled={!pickupLocation.trim() || !destinationLocation.trim()}
              fun={() => getDistanceAndFare(pickupLocation, destinationLocation)}
              classes="booking-primary-button"
            />
            <p className="booking-footnote">Upfront prices. No surprises.</p>
          </motion.div>
        ) : showSelectVehiclePanel ? (
          <SelectVehicle
            key="select-vehicle"
            selectedVehicle={selectedVehicle}
            onSelectVehicle={setSelectedVehicle}
            showPanel
            setShowPanel={setShowSelectVehiclePanel}
            showPreviousPanel={setShowFindTripPanel}
            showNextPanel={setShowRideDetailsPanel}
            fare={fare}
          />
        ) : showRideDetailsPanel ? (
          <RideDetails
            key="ride-details"
            pickupLocation={pickupLocation}
            destinationLocation={destinationLocation}
            selectedVehicle={selectedVehicle}
            fare={fare}
            showPanel
            setShowPanel={setShowRideDetailsPanel}
            showPreviousPanel={setShowSelectVehiclePanel}
            createRide={createRide}
            cancelRide={cancelRide}
            loading={loading}
            rideCreated={rideCreated}
            confirmedRideData={confirmedRideData}
            errorMessage={errorMessage}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default UserHomeScreen;
