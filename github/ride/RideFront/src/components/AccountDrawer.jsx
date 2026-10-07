import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, History, LogOut, ShieldCheck, UserRound, X, Wallet } from "lucide-react";
import api, { clearSession } from "../utils/api";
import { ROLES } from "../utils/roles";
import { Avatar, Button, ConfirmDialog, Stars, fullNameOf } from "./ui";
import "./AccountDrawer.css";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Slide-in account menu used on both map screens. */
export default function AccountDrawer({ open, onClose, role, account, children }) {
  const navigate = useNavigate();
  const config = ROLES[role];
  const panelRef = useRef(null);
  const [confirming, setConfirming] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    panelRef.current?.querySelector(FOCUSABLE)?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll(FOCUSABLE)];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await api.post(`/${role}/logout`);
    } catch {
      // Whatever the server says, the person asked to leave: finish locally.
    } finally {
      clearSession();
      navigate(config.login, { replace: true });
    }
  };

  const links = [
    { to: config.history, icon: History, label: role === "user" ? "Your trips" : "Trip history" },
    { to: config.profile, icon: UserRound, label: "Profile" },
    { to: `${config.profile}#security`, icon: ShieldCheck, label: "Security & safety", badge: account?.twoFactorEnabled === false ? "Action needed" : null },
  ];

  return createPortal(
    <>
      <div className={`drawer-scrim ${open ? "is-open" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside
        ref={panelRef}
        className={`drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Account menu"
        aria-hidden={!open}
        inert={!open ? "" : undefined}
      >
        <div className="drawer-head">
          <Avatar fullname={account?.fullname} size="lg" />
          <div className="drawer-id">
            <strong>{fullNameOf(account?.fullname) || "Your account"}</strong>
            <span>{account?.email}</span>
            <Stars rating={account?.rating} />
          </div>
          <button type="button" className="qr-back" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {children}

        <nav className="drawer-nav" aria-label="Account">
          {links.map(({ to, icon: Icon, label, badge }) => (
            <Link key={label} to={to} className="drawer-link" onClick={onClose}>
              <span className="qr-list-item-icon">
                <Icon size={19} aria-hidden="true" />
              </span>
              <span style={{ flex: 1 }}>{label}</span>
              {badge && <span className="qr-badge qr-badge--warning">{badge}</span>}
              <ChevronRight size={18} color="var(--ink-300)" aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <div className="drawer-foot">
          <Button variant="secondary" icon={<LogOut size={18} />} onClick={() => setConfirming(true)}>
            Sign out
          </Button>
          <p className="qr-hint" style={{ textAlign: "center" }}>
            <Wallet size={12} style={{ display: "inline", marginRight: 4 }} aria-hidden="true" />
            Cash payments only for now
          </p>
        </div>
      </aside>
      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={logout}
        loading={loggingOut}
        title="Sign out of QuickRide?"
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        tone="danger"
      >
        You will need your password and a two-factor code to sign back in on this device.
      </ConfirmDialog>
    </>,
    document.body,
  );
}
