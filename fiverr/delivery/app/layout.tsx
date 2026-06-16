import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import LOGO from "./components/Logo";
// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Feitsma Verhuizingen — Logistics Platform",
  description: "Manage shipments, routes, and fleet operations in one place.",
};

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link
      href="/home"
      className="logo-link"
      aria-label="Feitsma Verhuizingen home"
    >
      <span className="logo-icon">
        <LOGO />
      </span>
      <span className="logo-text">Feitsma Verhuizingen</span>
    </Link>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Logo />

            <nav className="site-nav" aria-label="Main navigation">
              <Link href="/shipments" className="nav-link">
                Shipments
              </Link>
              <Link href="/best-route" className="nav-link">
                Routes
              </Link>
              <Link href="/new-shipment" className="nav-link">
                New Shipment
              </Link>
            </nav>
          </div>
        </header>

        <main className="site-main">{children}</main>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          html { font-size: 16px; -webkit-text-size-adjust: 100%; }

          body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f1f5f9;
            color: #0f172a;
            line-height: 1.5;
            min-height: 100vh;
          }

          /* ── Header ── */
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

          /* ── Logo (link to homepage) ── */
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

          .logo-link:hover { opacity: 0.85; }
          .logo-link:active { transform: scale(0.98); }

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

          /* ── Nav ── */
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

          .nav-link:hover { color: #1e40af; }

          .nav-link:focus-visible {
            outline: 2px solid #1e40af;
            outline-offset: 2px;
            border-radius: 4px;
          }

          /* ── Main content area ── */
          .site-main {
            min-height: calc(100vh - 64px);
          }

          /* ══════════════════════════════
             RESPONSIVE
          ══════════════════════════════ */

          @media (max-width: 599px) {
            .site-header-inner { height: 56px; }
            .logo-text { font-size: 17px; }
            .site-nav { gap: 12px; }
            .nav-link { font-size: 12px; }
          }

          @media (max-width: 379px) {
            .nav-link:nth-child(3) { display: none; } /* hide least-critical link on tiny screens */
          }

          /* ── Dark mode ── */
          @media (prefers-color-scheme: dark) {
            body { background: #0b1220; color: #f1f5f9; }
            .site-header { background: #111d35; border-bottom-color: #2a3a52; }
            .logo-text { color: #f1f5f9; }
            .nav-link { color: #94a3b8; }
            .nav-link:hover { color: #60a5fa; }
          }

          /* ── Reduced motion ── */
          @media (prefers-reduced-motion: reduce) {
            * { transition-duration: 0.01ms !important; }
          }
        `}</style>
      </body>
    </html>
  );
}
