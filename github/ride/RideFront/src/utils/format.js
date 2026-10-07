export const money = (value) =>
  value == null || Number.isNaN(Number(value)) ? "—" : `$${Number(value).toFixed(2)}`;

export function formatDistance(meters) {
  if (meters == null) return "—";
  if (meters < 950) return `${Math.round(meters / 10) * 10} m`;
  return `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)} km`;
}

export function formatDuration(seconds) {
  if (seconds == null) return "—";
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

const dayFormat = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

export const formatDate = (value) => (value ? dayFormat.format(new Date(value)) : "");
export const formatTime = (value) => (value ? timeFormat.format(new Date(value)) : "");

// "Home, Block 4, City" -> { title: "Home", subtitle: "Block 4, City" }
export function splitAddress(address = "") {
  const [title, ...rest] = address.split(", ");
  return { title: title || address, subtitle: rest.join(", ") };
}

export const VEHICLES = {
  car: { name: "QuickRide", tagline: "Everyday comfort", seats: 4, image: "/car.png" },
  bike: { name: "QuickBike", tagline: "Beat the traffic", seats: 1, image: "/bike.webp" },
  auto: { name: "QuickAuto", tagline: "A little more room", seats: 3, image: "/auto.webp" },
};

export const vehicleLabel = (type) => VEHICLES[type]?.name || "QuickRide";
