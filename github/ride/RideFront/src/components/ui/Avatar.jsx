import { useState } from "react";
import { Star } from "lucide-react";

export function initialsOf(fullname) {
  const first = fullname?.firstname?.[0] || "";
  const last = fullname?.lastname?.[0] || "";
  return (first + last).toUpperCase() || "?";
}

export function fullNameOf(fullname) {
  return [fullname?.firstname, fullname?.lastname].filter(Boolean).join(" ");
}

export function Avatar({ fullname, size, label }) {
  return (
    <span
      className={`qr-avatar ${size === "lg" ? "qr-avatar--lg" : ""} ${size === "sm" ? "qr-avatar--sm" : ""}`}
      role="img"
      aria-label={label || fullNameOf(fullname) || "Account"}
    >
      {initialsOf(fullname)}
    </span>
  );
}

/** Read-only average, e.g. "4.8 (32)". Shows "New" until the account has any ratings. */
export function Stars({ rating }) {
  if (!rating?.count) return <span className="qr-stars">New</span>;
  return (
    <span className="qr-stars" aria-label={`Rated ${rating.avg.toFixed(1)} out of 5 from ${rating.count} ratings`}>
      <Star size={14} aria-hidden="true" />
      {rating.avg.toFixed(1)}
    </span>
  );
}

/** Tap-to-rate control (radio group semantics). */
export function StarRating({ value, onChange, label = "Rating" }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div role="radiogroup" aria-label={label} style={{ display: "flex", justifyContent: "center", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            display: "grid",
            width: 48,
            height: 48,
            placeItems: "center",
            border: 0,
            background: "transparent",
            color: star <= shown ? "#f0a500" : "var(--ink-200)",
            transition: "transform var(--dur-fast) ease, color var(--dur-fast) ease",
            transform: star <= shown ? "scale(1.08)" : "none",
          }}
        >
          <Star size={34} fill={star <= shown ? "#f0a500" : "none"} strokeWidth={1.6} />
        </button>
      ))}
    </div>
  );
}

export function Plate({ children }) {
  return <span className="qr-plate">{children}</span>;
}
