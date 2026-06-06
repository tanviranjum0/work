/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, FormEvent, ChangeEvent, JSX } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  rightSlot?: JSX.Element;
}

/* ─── Icons ─────────────────────────────────────────────────────────────── */

function ShipSwiftLogo(): JSX.Element {
  return (
    <svg
      width={34}
      height={34}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={34} height={34} rx={8} fill="#1B3FAB" />
      {/* box body */}
      <rect
        x={7}
        y={13}
        width={20}
        height={13}
        rx={1.5}
        fill="#fff"
        fillOpacity={0.95}
      />
      {/* box flap */}
      <path d="M7 16h20" stroke="#1B3FAB" strokeWidth={1.2} />
      <path
        d="M14 13v3M20 13v3"
        stroke="#1B3FAB"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      {/* arrow */}
      <path
        d="M12 20h10M18 17.5l2.5 2.5L18 22.5"
        stroke="#1B3FAB"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon(): JSX.Element {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx={12} cy={12} r={3} />
    </svg>
  );
}

function EyeOffIcon(): JSX.Element {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1={1} y1={1} x2={23} y2={23} />
    </svg>
  );
}

function GoogleIcon(): JSX.Element {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24">
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
  );
}

function MicrosoftIcon(): JSX.Element {
  return (
    <svg width={18} height={18} viewBox="0 0 21 21">
      <rect x={0} y={0} width={10} height={10} fill="#F25022" />
      <rect x={11} y={0} width={10} height={10} fill="#7FBA00" />
      <rect x={0} y={11} width={10} height={10} fill="#00A4EF" />
      <rect x={11} y={11} width={10} height={10} fill="#FFB900" />
    </svg>
  );
}

/* ─── InputField ─────────────────────────────────────────────────────────── */

function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
  rightSlot,
}: InputFieldProps): JSX.Element {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: "#111827",
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          style={{
            width: "100%",
            height: 42,
            border: "1px solid #D1D5DB",
            borderRadius: 6,
            padding: rightSlot ? "0 40px 0 12px" : "0 12px",
            fontSize: 13.5,
            color: "#111827",
            backgroundColor: "#fff",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#2563EB";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#D1D5DB";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {rightSlot && (
          <div
            style={{
              position: "absolute",
              right: 11,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    console.log("Login Data:", {
      email,
      password,
    });
    await new Promise<void>((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #E8EDF5;
          min-height: 100vh;
        }

        .ss-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background: #E8EDF5;
        }

        /* ── Card ── */
        .ss-card {
          display: flex;
          width: 100%;
          max-width: 780px;
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 2px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
        }

        /* ── Form side ── */
        .ss-form-side {
          flex: 1;
          min-width: 0;
          padding: 36px 36px 32px;
          display: flex;
          flex-direction: column;
        }

        /* Logo row */
        .ss-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 30px;
        }
        .ss-logo-text { display: flex; flex-direction: column; gap: 0; }
        .ss-logo-name {
          font-size: 17px;
          font-weight: 700;
          color: #1B3FAB;
          line-height: 1.1;
          letter-spacing: -0.2px;
        }
        .ss-logo-tag {
          font-size: 10.5px;
          font-weight: 500;
          color: #2563EB;
          letter-spacing: 0.1px;
        }

        /* Headings */
        .ss-h1 {
          font-size: 26px;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.4px;
          margin-bottom: 4px;
        }
        .ss-sub {
          font-size: 13.5px;
          color: #6B7280;
          font-weight: 400;
          margin-bottom: 24px;
        }

        /* Forgot */
        .ss-forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -6px;
          margin-bottom: 18px;
        }
        .ss-forgot {
          font-size: 12.5px;
          color: #2563EB;
          font-weight: 500;
          text-decoration: none;
        }
        .ss-forgot:hover { text-decoration: underline; }

        /* Login button */
        .ss-btn-login {
          width: 100%;
          height: 44px;
          background: #1B3FAB;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 0.1px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s;
          margin-bottom: 18px;
        }
        .ss-btn-login:hover:not(:disabled) { background: #1632A0; }
        .ss-btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

        .ss-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: ss-spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes ss-spin { to { transform: rotate(360deg); } }

        /* Divider */
        .ss-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .ss-divider-line {
          flex: 1;
          height: 1px;
          background: #E5E7EB;
        }
        .ss-divider-text {
          font-size: 12px;
          color: #9CA3AF;
          white-space: nowrap;
        }

        /* Social buttons */
        .ss-social-row {
          display: flex;
          gap: 10px;
          margin-bottom: 22px;
        }
        .ss-btn-social {
          flex: 1;
          height: 40px;
          border: 1px solid #D1D5DB;
          border-radius: 7px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, border-color 0.15s;
        }
        .ss-btn-social:hover { background: #F9FAFB; border-color: #9CA3AF; }

        /* Sign up row */
        .ss-signup-row {
          text-align: center;
          font-size: 13px;
          color: #6B7280;
        }
        .ss-signup-row a {
          color: #2563EB;
          font-weight: 600;
          text-decoration: none;
        }
        .ss-signup-row a:hover { text-decoration: underline; }

        /* Eye button */
        .ss-eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #9CA3AF;
          display: flex;
          align-items: center;
          padding: 0;
          line-height: 0;
          transition: color 0.15s;
        }
        .ss-eye-btn:hover { color: #374151; }

        /* ── Image side ── */
        .ss-img-side {
          width: 300px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .ss-img-side img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .ss-img-side { display: none; }
          .ss-card { max-width: 440px; }
        }
        @media (max-width: 480px) {
          .ss-page { padding: 0; align-items: flex-end; }
          .ss-card { border-radius: 20px 20px 0 0; max-width: 100%; }
          .ss-form-side { padding: 28px 22px 32px; }
        }
      `}</style>

      <div className="ss-page">
        <div className="ss-card">
          {/* ── Form Side ── */}
          <div className="ss-form-side">
            {/* Logo */}
            <div className="ss-logo">
              <ShipSwiftLogo />
              <div className="ss-logo-text">
                <span className="ss-logo-name">ShipSwift</span>
                <span className="ss-logo-tag">Delivering Reliability</span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="ss-h1">Welcome Back</h1>
            <p className="ss-sub">Login to your account</p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <InputField
                id="email"
                label="Email address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                required
              />

              <InputField
                id="password"
                label="Password"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                required
                rightSlot={
                  <button
                    type="button"
                    className="ss-eye-btn"
                    onClick={() => setShowPass((p) => !p)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />

              {/* Forgot password */}
              <div className="ss-forgot-row">
                <a href="#" className="ss-forgot">
                  Forgot password?
                </a>
              </div>

              {/* Login button */}
              <button type="submit" className="ss-btn-login" disabled={loading}>
                {loading ? <span className="ss-spinner" /> : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="ss-divider">
              <div className="ss-divider-line" />
              <span className="ss-divider-text">or continue with</span>
              <div className="ss-divider-line" />
            </div>

            {/* Social */}
            <div className="ss-social-row">
              <button type="button" className="ss-btn-social">
                <GoogleIcon /> Google
              </button>
              <button type="button" className="ss-btn-social">
                <MicrosoftIcon /> Microsoft
              </button>
            </div>

            {/* Sign up */}
            <p className="ss-signup-row">
              Don&apos;t have an account? <a href="/signup">Sign up</a>
            </p>
          </div>

          {/* ── Image Side ── */}
          <div className="ss-img-side">
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=85&auto=format&fit=crop"
              alt="Blue freight truck on a highway through mountain valley"
            />
          </div>
        </div>
      </div>
    </>
  );
}
