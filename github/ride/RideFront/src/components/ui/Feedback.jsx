import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

export function Spinner({ size = 22, label = "Loading" }) {
  return (
    <span
      className="qr-spinner"
      style={{ width: size, height: size, color: "var(--brand-600)" }}
      role="status"
      aria-label={label}
    />
  );
}

export function Skeleton({ width = "100%", height = 16, radius, style }) {
  return (
    <span
      className="qr-skeleton"
      aria-hidden="true"
      style={{ display: "block", width, height, borderRadius: radius, ...style }}
    />
  );
}

const BANNER_ICONS = {
  info: Info,
  danger: AlertCircle,
  warning: TriangleAlert,
  success: CheckCircle2,
};

export function Banner({ tone = "info", children, action, role }) {
  const Icon = BANNER_ICONS[tone] || Info;
  return (
    <div
      className={`qr-banner ${tone === "info" ? "" : `qr-banner--${tone}`}`}
      role={role || (tone === "danger" ? "alert" : "status")}
    >
      <Icon size={18} aria-hidden="true" />
      <div style={{ flex: 1 }}>{children}</div>
      {action}
    </div>
  );
}

export function Badge({ tone = "brand", children, icon }) {
  return (
    <span className={`qr-badge ${tone === "brand" ? "" : `qr-badge--${tone}`}`}>
      {icon}
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, children, action }) {
  return (
    <div className="qr-empty">
      {icon && <span className="qr-empty-icon">{icon}</span>}
      <h2>{title}</h2>
      {children && <p style={{ maxWidth: 320 }}>{children}</p>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

export function FullScreenLoader({ label = "Loading" }) {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "var(--app-height)" }}>
      <Spinner size={34} label={label} />
    </div>
  );
}
