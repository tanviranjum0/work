import { useCallback, useEffect, useRef, useState } from "react";
import { bearing, distanceMeters } from "../utils/geo";

const ERRORS = {
  1: "Location access is off. Allow it in your browser settings to share where you are.",
  2: "We could not work out where you are. Check that location is turned on.",
  3: "Finding your location is taking too long. Try again.",
};

/**
 * Live device position.
 *  - `watch: true` keeps following the device; otherwise `locate()` takes one fix.
 *  - `heading` is the direction of travel, taken from the device when it provides it and
 *    otherwise derived from the last few metres moved.
 *  - `onFix` fires for every accepted fix (used to stream the driver's location).
 */
export default function useGeolocation({ watch = false, onFix, highAccuracy = true } = {}) {
  const [position, setPosition] = useState(null); // { ltd, lng, accuracy, heading, speed, at }
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const lastRef = useRef(null);
  const onFixRef = useRef(onFix);
  onFixRef.current = onFix;

  const accept = useCallback((pos) => {
    const next = { ltd: pos.coords.latitude, lng: pos.coords.longitude };
    let heading = Number.isFinite(pos.coords.heading) ? pos.coords.heading : undefined;
    const previous = lastRef.current;
    if (heading === undefined && previous && distanceMeters(previous, next) > 6) {
      heading = bearing(previous, next);
    }
    const fix = {
      ...next,
      accuracy: pos.coords.accuracy,
      heading: heading ?? previous?.heading,
      speed: Number.isFinite(pos.coords.speed) ? pos.coords.speed : undefined,
      at: pos.timestamp,
    };
    lastRef.current = fix;
    setPosition(fix);
    setError("");
    setLocating(false);
    onFixRef.current?.(fix);
  }, []);

  const fail = useCallback((err) => {
    setError(ERRORS[err.code] || ERRORS[2]);
    setLocating(false);
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("This browser cannot share your location.");
      return Promise.resolve(null);
    }
    setLocating(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          accept(pos);
          resolve(lastRef.current);
        },
        (err) => {
          fail(err);
          resolve(null);
        },
        { enableHighAccuracy: highAccuracy, timeout: 15000, maximumAge: 5000 },
      );
    });
  }, [accept, fail, highAccuracy]);

  useEffect(() => {
    if (!watch || !navigator.geolocation) return undefined;
    const id = navigator.geolocation.watchPosition(accept, fail, {
      enableHighAccuracy: highAccuracy,
      maximumAge: 2000,
      timeout: 20000,
    });
    return () => navigator.geolocation.clearWatch(id);
  }, [watch, accept, fail, highAccuracy]);

  return { position, error, locating, locate };
}
