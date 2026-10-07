import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

export function Brand({ to = "/" }) {
  return (
    <Link to={to} className="qr-brand" aria-label="QuickRide home">
      <span className="qr-brand-mark">
        <MapPin size={19} aria-hidden="true" />
      </span>
      <span>
        quickride<span className="qr-brand-dot">.</span>
      </span>
    </Link>
  );
}

/** Consistent shell for sign-in, sign-up, reset and verification screens. */
export function AuthLayout({ children, footer }) {
  return (
    <div className="qr-auth">
      <header className="qr-auth-header">
        <Brand />
      </header>
      <main className="qr-auth-main">{children}</main>
      <footer className="qr-auth-footer">
        {footer || "By continuing you agree to the QuickRide Terms and Privacy Policy."}
      </footer>
    </div>
  );
}

export function BackButton({ to, label = "Go back" }) {
  const navigate = useNavigate();
  return (
    <button type="button" className="qr-back" onClick={() => (to ? navigate(to) : navigate(-1))} aria-label={label}>
      <ArrowLeft size={20} aria-hidden="true" />
    </button>
  );
}

/** Content page with a back button and title (history, profile, safety settings...). */
export function PageShell({ title, backTo, actions, children, width }) {
  return (
    <div className="qr-page">
      <div className="qr-page-inner" style={width ? { width: `min(100%, ${width}px)` } : undefined}>
        <div className="qr-topbar">
          <BackButton to={backTo} />
          <h1>{title}</h1>
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}
