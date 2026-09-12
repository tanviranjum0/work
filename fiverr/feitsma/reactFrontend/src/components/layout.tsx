import Logo from "./Logo";
import { Outlet, Link } from "react-router-dom";

function MainLogo() {
  return (
    <Link
      to="/home"
      className="logo-link"
      aria-label="Feitsma Verhuizingen home"
    >
      <span className="logo-icon">
        <Logo />
      </span>

      <span className="logo-text hidden sm:block">Feitsma Verhuizingen</span>
    </Link>
  );
}

export default function RootLayout() {
  return (
    <div className="body-container">
      <header className="site-header">
        <div className="site-header-inner">
          <MainLogo />

          <nav className="site-nav" aria-label="Main navigation">
            <Link to="/shipments" className="nav-link">
              Shipments
            </Link>

            <Link to="/get-route" className="nav-link">
              Get Route
            </Link>

            <Link to="/routes" className="nav-link">
              Routes
            </Link>

            <Link to="/new-shipment" className="nav-link">
              New Shipment
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />

      <style>{`
        .body-container {
          font-family: "Roboto",'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f1f5f9;
          color: #0f172a;
          line-height: 1.5;
          min-height: 100vh;
        }

        .site-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
        }

        .site-header-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 0 clamp(14px, 3vw, 32px);
          height: 64px;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          border-radius: 8px;
          padding: 4px;
          margin: -4px;
          transition: opacity 0.15s, background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }

        .logo-link:hover {
          opacity: 0.85;
        }

        .logo-link:active {
          transform: scale(0.98);
        }

        .logo-link:focus-visible {
          outline: 2px solid #1e40af;
          outline-offset: 2px;
        }

        .logo-icon {
          display: flex;
          flex-shrink: 0;
        }

        .logo-text {
          font-size: clamp(18px, 3vw, 22px);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .site-nav {
          display: flex;
          align-items: center;
          gap: clamp(8px, 2vw, 24px);
        }

        .nav-link {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          padding: 8px 4px;
          transition: color 0.15s;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #1e40af;
        }

        .nav-link:focus-visible {
          outline: 2px solid #1e40af;
          outline-offset: 2px;
          border-radius: 4px;
        }

        @media (max-width: 599px) {
          .site-header-inner {
            height: 56px;
          }

          .logo-text {
            font-size: 17px;
          }

          .site-nav {
            gap: 12px;
          }

          .nav-link {
            font-size: 12px;
          }
        }

        @media (max-width: 379px) {
          .nav-link:nth-child(3) {
            display: none;
          }
        }

        @media (prefers-color-scheme: dark) {
          .body-container {
            background: #0b1220;
            color: #f1f5f9;
          }

          .site-header {
            background: #111d35;
            border-bottom-color: #2a3a52;
          }

          .logo-text {
            color: #f1f5f9;
          }

          .nav-link {
            color: #94a3b8;
          }

          .nav-link:hover {
            color: #60a5fa;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-link,
          .nav-link {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
