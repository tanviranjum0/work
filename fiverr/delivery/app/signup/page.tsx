"use client";

import Link from "next/link";
import { useState, FormEvent, ChangeEvent, JSX } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Step = 1 | 2;

interface PasswordStrength {
  label: string;
  barColor: string;
  textColor: string;
  pct: string;
}

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  optional?: boolean;
  hasError?: boolean;
  errorMsg?: string;
  rightSlot?: JSX.Element;
  leadingIcon?: JSX.Element;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getStrength(pw: string): PasswordStrength {
  if (!pw)
    return { label: "", barColor: "transparent", textColor: "", pct: "0%" };
  if (pw.length < 6)
    return {
      label: "Weak",
      barColor: "#EF4444",
      textColor: "#EF4444",
      pct: "30%",
    };
  if (pw.length < 10)
    return {
      label: "Fair",
      barColor: "#F59E0B",
      textColor: "#D97706",
      pct: "62%",
    };
  return {
    label: "Strong",
    barColor: "#22C55E",
    textColor: "#16A34A",
    pct: "100%",
  };
}

/* ─── Icons ─────────────────────────────────────────────────────────────── */

function ShipSwiftLogo(): JSX.Element {
  return (
    <svg width={34} height={34} viewBox="0 0 34 34" fill="none">
      <rect width={34} height={34} rx={8} fill="#1B3FAB" />
      <rect
        x={7}
        y={13}
        width={20}
        height={13}
        rx={1.5}
        fill="#fff"
        fillOpacity={0.95}
      />
      <path d="M7 16h20" stroke="#1B3FAB" strokeWidth={1.2} />
      <path
        d="M14 13v3M20 13v3"
        stroke="#1B3FAB"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
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

function UserIcon(): JSX.Element {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9CA3AF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx={12} cy={7} r={4} />
    </svg>
  );
}

function MailIcon(): JSX.Element {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9CA3AF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PhoneIcon(): JSX.Element {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9CA3AF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.12 2 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function BuildingIcon(): JSX.Element {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9CA3AF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x={2} y={7} width={20} height={14} rx={2} />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  );
}

function ArrowRightIcon(): JSX.Element {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon(): JSX.Element {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

/* ─── Reusable InputField ─────────────────────────────────────────────────── */

function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  optional,
  hasError,
  errorMsg,
  rightSlot,
  leadingIcon,
}: InputFieldProps): JSX.Element {
  const [focused, setFocused] = useState(false);

  const borderColor = hasError ? "#EF4444" : focused ? "#2563EB" : "#D1D5DB";

  const shadow = hasError
    ? "0 0 0 3px rgba(239,68,68,0.10)"
    : focused
      ? "0 0 0 3px rgba(37,99,235,0.10)"
      : "none";

  return (
    <div style={{ marginBottom: hasError && errorMsg ? 6 : 14 }}>
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
        {optional && (
          <span style={{ fontWeight: 400, color: "#9CA3AF", marginLeft: 4 }}>
            (optional)
          </span>
        )}
      </label>
      <div style={{ position: "relative" }}>
        {leadingIcon && (
          <span
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            {leadingIcon}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            height: 42,
            border: `1px solid ${borderColor}`,
            borderRadius: 6,
            paddingLeft: leadingIcon ? 34 : 12,
            paddingRight: rightSlot ? 40 : 12,
            fontSize: 13.5,
            color: "#111827",
            backgroundColor: "#fff",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            boxShadow: shadow,
            transition: "border-color 0.15s, box-shadow 0.15s",
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
      {hasError && errorMsg && (
        <p
          style={{
            fontSize: 11.5,
            color: "#EF4444",
            marginTop: 4,
            fontWeight: 500,
          }}
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}

/* ─── Step Indicator ─────────────────────────────────────────────────────── */

function StepIndicator({ step }: { step: Step }): JSX.Element {
  const dotStyle = (n: number): React.CSSProperties => ({
    width: 26,
    height: 26,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
    backgroundColor: n < step ? "#22C55E" : n === step ? "#1B3FAB" : "#E5E7EB",
    color: n <= step ? "#fff" : "#9CA3AF",
    transition: "background-color 0.25s",
  });

  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={dotStyle(1)}>
          {step > 1 ? (
            <svg
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            "1"
          )}
        </div>
        <div
          style={{
            flex: 1,
            height: 2,
            margin: "0 6px",
            backgroundColor: step > 1 ? "#22C55E" : "#E5E7EB",
            transition: "background-color 0.25s",
          }}
        />
        <div style={dotStyle(2)}>2</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 5,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: step === 1 ? "#1B3FAB" : "#22C55E",
          }}
        >
          Personal Info
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: step === 2 ? "#1B3FAB" : "#9CA3AF",
          }}
        >
          Account Setup
        </span>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function SignUpPage(): JSX.Element {
  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // Step 2
  const [company, setCompany] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConf, setShowConf] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const strength = getStrength(password);
  const mismatch: boolean = confirm.length > 0 && confirm !== password;
  const canSubmit: boolean =
    agreed && !mismatch && password.length >= 6 && !loading;

  const handleStep1 = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
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

        /* ── Image side ── */
        .ss-img-side {
          width: 280px;
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

        /* ── Form side ── */
        .ss-form-side {
          flex: 1;
          min-width: 0;
          padding: 32px 36px 30px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        /* Logo */
        .ss-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 24px;
        }
        .ss-logo-name {
          font-size: 17px;
          font-weight: 700;
          color: #1B3FAB;
          line-height: 1.1;
          letter-spacing: -0.2px;
          display: block;
        }
        .ss-logo-tag {
          font-size: 10.5px;
          font-weight: 500;
          color: #2563EB;
          display: block;
        }

        /* Headings */
        .ss-h1 {
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.3px;
          margin-bottom: 3px;
        }
        .ss-sub {
          font-size: 13px;
          color: #6B7280;
          margin-bottom: 20px;
        }

        /* Primary button */
        .ss-btn-primary {
          width: 100%;
          height: 44px;
          background: #1B3FAB;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14.5px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: background 0.18s;
          margin-top: 4px;
        }
        .ss-btn-primary:hover:not(:disabled) { background: #1632A0; }
        .ss-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .ss-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: ss-spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes ss-spin { to { transform: rotate(360deg); } }

        /* Outline button */
        .ss-btn-outline {
          height: 44px;
          padding: 0 16px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          background: #fff;
          font-size: 13.5px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, border-color 0.15s;
          margin-top: 4px;
        }
        .ss-btn-outline:hover { background: #F9FAFB; border-color: #9CA3AF; }

        /* Divider */
        .ss-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 16px 0 13px;
        }
        .ss-divider-line { flex: 1; height: 1px; background: #E5E7EB; }
        .ss-divider-text { font-size: 12px; color: #9CA3AF; white-space: nowrap; }

        /* Social */
        .ss-social-row { display: flex; gap: 10px; margin-bottom: 20px; }
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

        /* Login row */
        .ss-login-row {
          text-align: center;
          font-size: 13px;
          color: #6B7280;
          margin-top: 2px;
        }
        .ss-login-row a {
          color: #2563EB;
          font-weight: 600;
          text-decoration: none;
        }
        .ss-login-row a:hover { text-decoration: underline; }

        /* Strength bar */
        .ss-strength-wrap {
          margin-top: -8px;
          margin-bottom: 12px;
        }
        .ss-strength-track {
          height: 3px;
          background: #E5E7EB;
          border-radius: 99px;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .ss-strength-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.3s, background-color 0.3s;
        }

        /* Checkbox row */
        .ss-check-row {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin: 14px 0;
        }
        .ss-check-row input[type="checkbox"] {
          width: 16px; height: 16px;
          margin-top: 1.5px;
          flex-shrink: 0;
          accent-color: #1B3FAB;
          cursor: pointer;
        }
        .ss-check-row label {
          font-size: 12.5px;
          color: #4B5563;
          line-height: 1.55;
          cursor: pointer;
        }
        .ss-check-row a { color: #2563EB; font-weight: 600; text-decoration: none; }
        .ss-check-row a:hover { text-decoration: underline; }

        /* Button row */
        .ss-btn-row { display: flex; gap: 10px; align-items: stretch; }

        /* Eye button */
        .ss-eye {
          background: none; border: none; cursor: pointer;
          color: #9CA3AF; display: flex; align-items: center;
          padding: 0; line-height: 0; transition: color 0.15s;
        }
        .ss-eye:hover { color: #374151; }

        /* Success screen */
        .ss-success {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px 0;
        }
        .ss-success-icon {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: #1B3FAB;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 6px 20px rgba(27,63,171,0.30);
        }
        .ss-success-title {
          font-size: 21px;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.3px;
          margin-bottom: 8px;
        }
        .ss-success-sub {
          font-size: 13.5px;
          color: #6B7280;
          line-height: 1.6;
          max-width: 300px;
          margin: 0 auto 24px;
        }
        .ss-success-btn {
          height: 44px;
          padding: 0 28px;
          background: #1B3FAB;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: background 0.18s;
        }
        .ss-success-btn:hover { background: #1632A0; }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .ss-img-side { display: none; }
          .ss-card { max-width: 440px; }
        }
        @media (max-width: 480px) {
          .ss-page { padding: 0; align-items: flex-end; }
          .ss-card { border-radius: 20px 20px 0 0; max-width: 100%; }
          .ss-form-side { padding: 26px 20px 32px; }
        }
      `}</style>

      <div className="ss-page">
        <div className="ss-card">
          {/* ── Image side (left) ── */}
          <div className="ss-img-side">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=560&q=85&auto=format&fit=crop"
              alt="Warehouse and logistics"
            />
          </div>

          {/* ── Form side ── */}
          <div className="ss-form-side">
            {/* Logo */}
            <div className="ss-logo">
              <ShipSwiftLogo />
              <div>
                <span className="ss-logo-name">ShipSwift</span>
                <span className="ss-logo-tag">Delivering Reliability</span>
              </div>
            </div>

            {done ? (
              /* ── Success ── */
              <div className="ss-success">
                <div className="ss-success-icon">
                  <svg
                    width={30}
                    height={30}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="ss-success-title">Account Created!</h2>
                <p className="ss-success-sub">
                  Welcome to ShipSwift, {fullName.split(" ")[0] || "there"}!
                  <br />
                  Check your email to verify your address and get started.
                </p>
                <button className="ss-success-btn">
                  Go to Dashboard <ArrowRightIcon />
                </button>
              </div>
            ) : (
              <>
                {/* Step indicator */}
                <StepIndicator step={step} />

                {step === 1 ? (
                  /* ── Step 1: Personal Info ── */
                  <>
                    <h1 className="ss-h1">Create Account</h1>
                    <p className="ss-sub">
                      Start shipping smarter today — it&apos;s free
                    </p>

                    <form onSubmit={handleStep1}>
                      <InputField
                        id="fullName"
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        required
                        leadingIcon={<UserIcon />}
                      />
                      <InputField
                        id="email"
                        label="Email address"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        leadingIcon={<MailIcon />}
                      />
                      <InputField
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        required
                        leadingIcon={<PhoneIcon />}
                      />

                      <button type="submit" className="ss-btn-primary">
                        Continue <ArrowRightIcon />
                      </button>
                    </form>

                    <div className="ss-divider">
                      <div className="ss-divider-line" />
                      <span className="ss-divider-text">or sign up with</span>
                      <div className="ss-divider-line" />
                    </div>

                    <div className="ss-social-row">
                      <button type="button" className="ss-btn-social">
                        <GoogleIcon /> Google
                      </button>
                      <button type="button" className="ss-btn-social">
                        <MicrosoftIcon /> Microsoft
                      </button>
                    </div>

                    <p className="ss-login-row">
                      Already have an account? <Link href="/login">Log in</Link>
                    </p>
                  </>
                ) : (
                  /* ── Step 2: Account Setup ── */
                  <>
                    <h1 className="ss-h1">Account Setup</h1>
                    <p className="ss-sub">Almost there — secure your account</p>

                    <form onSubmit={handleSubmit}>
                      <InputField
                        id="company"
                        label="Company / Business Name"
                        type="text"
                        placeholder="Acme Logistics Inc."
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        autoComplete="organization"
                        optional
                        leadingIcon={<BuildingIcon />}
                      />

                      {/* Password */}
                      <InputField
                        id="password"
                        label="Password"
                        type={showPass ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        minLength={6}
                        rightSlot={
                          <button
                            type="button"
                            className="ss-eye"
                            onClick={() => setShowPass((p) => !p)}
                            aria-label={showPass ? "Hide" : "Show"}
                          >
                            {showPass ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        }
                      />

                      {/* Strength bar */}
                      {password.length > 0 && (
                        <div className="ss-strength-wrap">
                          <div className="ss-strength-track">
                            <div
                              className="ss-strength-fill"
                              style={{
                                width: strength.pct,
                                backgroundColor: strength.barColor,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 11.5,
                              fontWeight: 600,
                              color: strength.textColor,
                            }}
                          >
                            {strength.label} password
                          </span>
                        </div>
                      )}

                      {/* Confirm password */}
                      <InputField
                        id="confirm"
                        label="Confirm Password"
                        type={showConf ? "text" : "password"}
                        placeholder="Repeat your password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        autoComplete="new-password"
                        required
                        hasError={mismatch}
                        errorMsg="Passwords do not match"
                        rightSlot={
                          <button
                            type="button"
                            className="ss-eye"
                            onClick={() => setShowConf((p) => !p)}
                            aria-label={showConf ? "Hide" : "Show"}
                          >
                            {showConf ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        }
                      />

                      {/* Terms */}
                      <div className="ss-check-row">
                        <input
                          type="checkbox"
                          id="agree"
                          checked={agreed}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setAgreed(e.target.checked)
                          }
                          required
                        />
                        <label htmlFor="agree">
                          I agree to ShipSwift&apos;s{" "}
                          <a href="#">Terms of Service</a> and{" "}
                          <a href="#">Privacy Policy</a>
                        </label>
                      </div>

                      {/* Buttons */}
                      <div className="ss-btn-row">
                        <button
                          type="button"
                          className="ss-btn-outline"
                          onClick={() => setStep(1)}
                        >
                          <ArrowLeftIcon /> Back
                        </button>
                        <button
                          type="submit"
                          className="ss-btn-primary"
                          disabled={!canSubmit}
                          style={{ flex: 1, marginTop: 4 }}
                        >
                          {loading ? (
                            <span className="ss-spinner" />
                          ) : (
                            "Create Account"
                          )}
                        </button>
                      </div>
                    </form>

                    <p className="ss-login-row" style={{ marginTop: 16 }}>
                      Already have an account? <a href="/login">Log in</a>
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
