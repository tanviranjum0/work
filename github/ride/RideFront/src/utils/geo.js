const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

// Points are { ltd, lng }, matching the API.
export function distanceMeters(a, b) {
  const dLat = toRad(b.ltd - a.ltd);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.ltd)) * Math.cos(toRad(b.ltd)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(h));
}

// Compass bearing from a to b in degrees (0 = north), used to point the driver's car icon.
export function bearing(a, b) {
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.ltd));
  const x =
    Math.cos(toRad(a.ltd)) * Math.sin(toRad(b.ltd)) -
    Math.sin(toRad(a.ltd)) * Math.cos(toRad(b.ltd)) * Math.cos(toRad(b.lng - a.lng));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export const toLngLat = (point) => (point ? [point.lng, point.ltd] : null);
export const toCoordString = (point) => `${point.ltd},${point.lng}`;
export const isPoint = (point) => Number.isFinite(point?.ltd) && Number.isFinite(point?.lng);
