import { forwardRef, useEffect, useRef, useState } from "react";
import "./map-screen.css";

/** Full-viewport map container; everything else floats above it. */
export function MapScreen({ children, className = "" }) {
  return <div className={`map-screen ${className}`}>{children}</div>;
}

/** Top row of floating controls: [left] [centre status] [right]. */
export function MapTopBar({ left, center, right }) {
  return (
    <header className="map-topbar">
      <div className="map-topbar-side">{left}</div>
      {center && <div className="map-topbar-center">{center}</div>}
      <div className="map-topbar-side map-topbar-side--end">{right}</div>
    </header>
  );
}

export const MapButton = forwardRef(function MapButton({ icon, label, children, ...props }, ref) {
  return (
    <button ref={ref} type="button" className={`map-btn ${children ? "map-btn--wide" : ""}`} aria-label={label} {...props}>
      {icon}
      {children && <span>{children}</span>}
    </button>
  );
});

/** Small status chip, e.g. "Driver arriving in 4 min". */
export function StatusPill({ tone = "default", icon, children }) {
  return (
    <div className={`map-pill ${tone === "default" ? "" : `map-pill--${tone}`}`} role="status">
      {icon}
      <span>{children}</span>
    </div>
  );
}

/**
 * The booking panel. A bottom sheet on phones, a floating card on desktop. It never grows
 * past the visible viewport: the body scrolls while `footer` (the main action) stays pinned,
 * so the primary button can no longer fall below the screen. It reports its height so the
 * map can keep the route framed above it.
 */
export function Sheet({ children, footer, label, onHeight, className = "" }) {
  const ref = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !onHeight) return undefined;
    const observer = new ResizeObserver(() => onHeight(Math.round(node.getBoundingClientRect().height)));
    observer.observe(node);
    return () => {
      observer.disconnect();
      onHeight(0);
    };
  }, [onHeight]);

  return (
    <section ref={ref} className={`map-sheet ${collapsed ? "is-collapsed" : ""} ${className}`} aria-label={label}>
      <button
        type="button"
        className="map-sheet-handle"
        onClick={() => setCollapsed((value) => !value)}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand panel to see the map less" : "Collapse panel to see more of the map"}
      />
      <div className="map-sheet-scroll">{children}</div>
      {footer && <div className="map-sheet-footer">{footer}</div>}
    </section>
  );
}

/** Padding the map should keep clear for the sheet and top bar, per layout. */
export function computeMapPadding({ desktop, sheetHeight }) {
  if (desktop) return { top: 104, right: 72, bottom: 56, left: 420 + 24 + 56 };
  return { top: 96, right: 36, bottom: Math.max(sheetHeight, 120) + 36, left: 36 };
}
