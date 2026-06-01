"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef2f7;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 16px;
        }

        /* ── Card ── */
        .card {
          width: 100%;
          max-width: 900px;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 8px 40px rgba(10, 30, 80, 0.12);
        }

        /* ── Left panel ── */
        .left {
          flex: 1;
          padding: 48px 44px 44px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #1a3faa 0%, #2258e8 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .logo-text { display: flex; flex-direction: column; line-height: 1.1; }
        .logo-name {
          font-size: 17px;
          font-weight: 800;
          color: #1a3faa;
          letter-spacing: -0.3px;
        }
        .logo-tagline {
          font-size: 10.5px;
          font-weight: 500;
          color: #2258e8;
          letter-spacing: 0.2px;
        }

        /* Heading */
        .heading {
          font-size: clamp(22px, 4vw, 28px);
          font-weight: 800;
          color: #0d1b3e;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .sub {
          font-size: 14px;
          color: #8693a8;
          margin-bottom: 28px;
          font-weight: 400;
        }

        /* Form */
        .field { margin-bottom: 16px; }
        .field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #3d4f6e;
          margin-bottom: 6px;
        }
        .input-wrap { position: relative; }
        .input-wrap input {
          width: 100%;
          height: 44px;
          border: 1.5px solid #dde3ee;
          border-radius: 10px;
          padding: 0 14px;
          font-family: inherit;
          font-size: 14px;
          color: #0d1b3e;
          background: #f8fafd;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .input-wrap input::placeholder { color: #b0bbd1; }
        .input-wrap input:focus {
          border-color: #2258e8;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(34, 88, 232, 0.12);
        }
        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #8693a8;
          display: flex;
          align-items: center;
          padding: 2px;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #2258e8; }

        /* Forgot */
        .row-forgot {
          display: flex;
          justify-content: flex-end;
          margin-top: -8px;
          margin-bottom: 20px;
        }
        .forgot {
          font-size: 12.5px;
          color: #2258e8;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.15s;
        }
        .forgot:hover { opacity: 0.75; }

        /* Login button */
        .btn-login {
          width: 100%;
          height: 46px;
          background: linear-gradient(135deg, #1a3faa 0%, #2258e8 100%);
          color: #fff;
          border: none;
          border-radius: 11px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.2px;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(34, 88, 232, 0.35);
        }
        .btn-login:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(34, 88, 232, 0.42);
        }
        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-login .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0;
          color: #b0bbd1;
          font-size: 12.5px;
          font-weight: 500;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e6eaf2;
        }

        /* Social buttons */
        .social-row {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .btn-social {
          flex: 1;
          height: 42px;
          border: 1.5px solid #dde3ee;
          border-radius: 10px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 600;
          color: #3d4f6e;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
        }
        .btn-social:hover {
          border-color: #2258e8;
          background: #f4f7ff;
          box-shadow: 0 2px 8px rgba(34,88,232,0.08);
        }

        /* Sign up */
        .signup-row {
          text-align: center;
          font-size: 13px;
          color: #8693a8;
        }
        .signup-row a {
          color: #2258e8;
          font-weight: 700;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .signup-row a:hover { opacity: 0.75; }

        /* ── Right panel ── */
        .right {
          width: 340px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          border-radius: 0 24px 24px 0;
        }
        .right img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .right-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(26, 63, 170, 0.22) 0%,
            rgba(10, 20, 60, 0.18) 100%
          );
        }
        .right-badge {
          position: absolute;
          bottom: 28px;
          left: 24px;
          right: 24px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 14px;
          padding: 16px 18px;
          color: #fff;
        }
        .badge-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
          letter-spacing: -0.2px;
        }
        .badge-sub {
          font-size: 12px;
          opacity: 0.82;
          line-height: 1.45;
        }

        /* ── Responsive ── */

        /* Tablet: hide right panel at 720px */
        @media (max-width: 760px) {
          .card { max-width: 480px; }
          .right { display: none; }
          .left { padding: 40px 32px 36px; }
        }

        /* Mobile */
        @media (max-width: 500px) {
          .login-root { padding: 0; align-items: flex-end; }
          .card {
            border-radius: 24px 24px 0 0;
            max-width: 100%;
            box-shadow: 0 -4px 32px rgba(10,30,80,0.10);
          }
          .left { padding: 32px 22px 36px; }
          .logo { margin-bottom: 28px; }
          .social-row { flex-direction: column; }
          .btn-social { flex: unset; }
        }

        /* Very small phones */
        @media (max-width: 360px) {
          .left { padding: 28px 18px 32px; }
          .heading { font-size: 20px; }
        }
      `}</style>

      <div className="login-root">
        <div className="card">
          {/* ── Left Panel ── */}
          <div className="left">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 9l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22V12h6v10"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 6l5-3 5 3"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="logo-text">
                <span className="logo-name">ShipSwift</span>
                <span className="logo-tagline">Delivering Reliability</span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="heading">Welcome Back</h1>
            <p className="sub">Login to your account</p>

            {/* Form */}
            <form onSubmit={handleLogin}>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <div className="input-wrap">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    style={{ paddingRight: "40px" }}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="row-forgot">
                <a href="#" className="forgot">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn-login" disabled={isLoading}>
                {isLoading ? <span className="spinner" /> : "Login"}
              </button>
            </form>

            <div className="divider">or continue with</div>

            <div className="social-row">
              <button type="button" className="btn-social">
                {/* Google icon */}
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>

              <button type="button" className="btn-social">
                {/* Microsoft icon */}
                <svg width="16" height="16" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                Microsoft
              </button>
            </div>

            <p className="signup-row">
              Don&apos;t have an account? <a href="#">Sign up</a>
            </p>
          </div>

          {/* ── Right Panel ── */}
          <div className="right">
            {/* Using a logistics/highway stock image via URL */}
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=680&q=80&auto=format&fit=crop"
              alt="A blue freight truck on a highway"
            />
            <div className="right-overlay" />
            <div className="right-badge">
              <p className="badge-title">Trusted Logistics Partner</p>
              <p className="badge-sub">
                Fast, reliable deliveries across the country — on time, every
                time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
