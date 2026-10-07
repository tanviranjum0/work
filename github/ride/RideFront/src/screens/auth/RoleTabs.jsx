import { Link } from "react-router-dom";
import { Car, User } from "lucide-react";
import { ROLES } from "../../utils/roles";

// Rider / Driver switch shared by sign-in and sign-up. Navigates between the two routes so
// each role keeps its own URL (and its own back-button history).
export default function RoleTabs({ active, to }) {
  return (
    <div className="qr-segmented qr-role-tabs" role="tablist" aria-label="Account type">
      {["user", "captain"].map((key) => (
        <Link
          key={key}
          to={ROLES[key][to]}
          role="tab"
          aria-selected={active === key}
          replace
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            minHeight: 40,
            borderRadius: "var(--radius-sm)",
            background: active === key ? "var(--surface)" : "transparent",
            boxShadow: active === key ? "var(--shadow-sm)" : "none",
            color: active === key ? "var(--ink-900)" : "var(--ink-500)",
            font: "700 var(--text-sm) / 1 var(--font-body)",
            textDecoration: "none",
          }}
        >
          {key === "user" ? <User size={16} aria-hidden="true" /> : <Car size={16} aria-hidden="true" />}
          {ROLES[key].label}
        </Link>
      ))}
    </div>
  );
}
