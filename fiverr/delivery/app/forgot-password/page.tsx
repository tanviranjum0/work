"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useCooldownTimer from "../hooks/useCooldownTimer";
import router from "../../../deliveryBackend/src/routes/shipments.route";
import { useRouter } from "next/navigation";
// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4; // email → verify → reset → success

interface FormState {
  email: string;
  code: string[]; // 6 digits
  password: string;
  confirm: string;
}

const DEFAULT_FORM: FormState = {
  email: "",
  code: ["", "", "", "", "", ""],
  password: "",
  confirm: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  const stars = "*".repeat(Math.max(user.length - 2, 3));
  return `${visible}${stars}@${domain}`;
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function hasUppercase(s: string) {
  return /[A-Z]/.test(s);
}
function hasNumber(s: string) {
  return /\d/.test(s);
}
function hasSpecial(s: string) {
  return /[^A-Za-z0-9]/.test(s);
}

function passwordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (hasUppercase(pw)) score++;
  if (hasNumber(pw)) score++;
  if (hasSpecial(pw)) score++;
  const map: { label: string; color: string }[] = [
    { label: "", color: "transparent" },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f97316" },
    { label: "Good", color: "#eab308" },
    { label: "Strong", color: "#22c55e" },
    { label: "Very Strong", color: "#16a34a" },
  ];
  return { score, ...map[Math.min(score, 5)] };
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1 as Step, label: "Verify Email" },
  { num: 2 as Step, label: "Verify" },
  { num: 3 as Step, label: "Reset" },
];

function Stepper({ current }: { current: Step }) {
  return (
    <div className="stepper">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className="step-item">
            <div
              className={`step-circle ${current === s.num ? "active" : current > s.num ? "done" : "idle"}`}
            >
              {current > s.num ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2 6.5l3.5 3.5 5.5-6"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                s.num
              )}
            </div>
            <span
              className={`step-label ${current === s.num ? "active-label" : current > s.num ? "done-label" : ""}`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`step-connector ${current > s.num ? "done-line" : ""}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Step 1 – Email Entry ─────────────────────────────────────────────────────

function StepEmail({
  startCooldown,
  form,
  setForm,
  onNext,
}: {
  startCooldown: () => void;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onNext: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const valid = isValidEmail(form.email);
  const [error, setError] = useState("");
  const handleSendVerificationEmail = async () => {
    setError("");
    setTouched(true);
    if (!valid) return setError("Please enter a valid Email");
    setLoading(true);
    // Simulate API call
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL +
        "/api/users/send-email-forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email }),
      },
    );

    const data = await res.json();
    if (data.message == "Invalid user") {
      setLoading(false);
      return setError(data.message);
    }
    startCooldown();
    onNext();
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="icon-header">
        <div className="icon-bubble">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M2 6l10 7 10-7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h2 className="card-title">Forgot Password?</h2>
      <p className="card-sub">
        Enter your account email and we'll send a 6-digit verification code to
        reset your password.
      </p>

      <Stepper current={1} />
      <div className="section-divider" />

      <div className="field-group">
        <label className="field-label" htmlFor="fp-email">
          Email Address
        </label>
        <div
          className={`input-wrap ${touched && valid ? "input-success" : ""}`}
        >
          <svg className="input-icon" viewBox="0 0 20 20" fill="none">
            <path
              d="M2.5 5.833h15M2.5 5.833A1.667 1.667 0 014.167 4.167h11.666A1.667 1.667 0 0117.5 5.833v8.334A1.667 1.667 0 0115.833 15.833H4.167A1.667 1.667 0 012.5 14.167V5.833z"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M2.5 5.833L10 10.833l7.5-5"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            id="fp-email"
            type="email"
            inputMode="email"
            className="text-input has-icon"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            onBlur={() => setTouched(true)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSendVerificationEmail()
            }
            autoComplete="email"
          />
          {touched && valid && (
            <svg
              className="input-status-icon success"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle cx="10" cy="10" r="8" fill="#22c55e" />
              <path
                d="M6.5 10l2.5 2.5 4.5-5"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {error && <p className="field-error text-center">{error}</p>}
      </div>

      <button
        className={`btn-primary full ${loading ? "loading" : ""}`}
        onClick={handleSendVerificationEmail}
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner /> Sending Code…
          </>
        ) : (
          "Send Verification Code"
        )}
      </button>

      <p className="back-link">
        <Link href="/login" className="link">
          ← Back to Log In
        </Link>
      </p>
    </div>
  );
}

// ─── Step 2 – 2FA Code Verification ──────────────────────────────────────────

function StepVerify({
  isActive,
  timeLeft,
  form,
  setForm,
  otpError,
  onNext,
  onBack,
}: {
  isActive: boolean;
  timeLeft: number;
  form: FormState;
  otpError: string;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [resending, setResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const codeComplete = form.code.every((d) => d !== "");

  const handleDigit = useCallback(
    (idx: number, val: string) => {
      const cleaned = val.replace(/\D/g, "").slice(-1);
      const next = [...form.code];
      next[idx] = cleaned;
      setForm((f) => ({ ...f, code: next }));
      setError("");
      if (cleaned && idx < 5) {
        inputRefs.current[idx + 1]?.focus();
      }
    },
    [form.code, setForm],
  );

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (form.code[idx]) {
        // clear current
        const next = [...form.code];
        next[idx] = "";
        setForm((f) => ({ ...f, code: next }));
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  // Handle paste of full code
  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setForm((f) => ({ ...f, code: pasted.split("") }));
      inputRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleVerify = () => {
    if (!codeComplete) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setLoading(false);
    // Simulate wrong code once for demo — in production verify against API
    const joined = form.code.join("");
    if (joined === "000000") {
      setError("Invalid code. Please try again.");
      setForm((f) => ({ ...f, code: ["", "", "", "", "", ""] }));
      inputRefs.current[0]?.focus();
    } else {
      onNext();
    }
    setLoading(true);
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendTimer(30);
      setForm((f) => ({ ...f, code: ["", "", "", "", "", ""] }));
      inputRefs.current[0]?.focus();
    }, 800);
  };

  return (
    <div className="card">
      <div className="icon-header">
        <div className="icon-bubble shield">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h2 className="card-title">Check Your Email</h2>
      <p className="card-sub">
        We sent a 6-digit code to <strong>{maskEmail(form.email)}</strong>.
        <br />
        Enter it below to continue.
      </p>

      <Stepper current={2} />
      <div className="section-divider" />

      <label
        className="field-label"
        style={{ marginBottom: 14, display: "block" }}
      >
        Verification Code
      </label>

      <div className="otp-row" onPaste={handlePaste}>
        {form.code.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            className={`otp-box ${error ? "otp-error" : digit ? "otp-filled" : ""}`}
            value={digit}
            onChange={(e) => handleDigit(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${idx + 1}`}
            autoComplete={idx === 0 ? "one-time-code" : "off"}
          />
        ))}
      </div>

      {error && (
        <p className="field-error" style={{ marginTop: 10 }}>
          {error}
        </p>
      )}

      {otpError && (
        <p className="field-error" style={{ marginTop: 10 }}>
          {otpError}
        </p>
      )}

      {isActive && (
        <p className="otp-hint">
          <strong>{timeLeft}</strong> seconds remaining
        </p>
      )}
      <button
        className={`btn-primary full ${loading ? "loading" : ""}`}
        onClick={handleVerify}
        disabled={loading || !codeComplete}
        style={{ marginTop: 20 }}
      >
        {loading ? (
          <>
            <Spinner /> Verifying…
          </>
        ) : (
          "Verify Code"
        )}
      </button>

      <p className="back-link">
        <button className="link btn-link" onClick={onBack}>
          ← Wrong email?
        </button>
      </p>
    </div>
  );
}

// ─── Step 3 – New Password ──────────────────────────────────────────────────

function StepReset({
  form,
  setOtpError,
  setForm,
  onNext,
  onBack,
}: {
  form: FormState;
  setOtpError: React.Dispatch<React.SetStateAction<string>>;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [touched, setTouched] = useState({ pw: false, cf: false });
  const [loading, setLoading] = useState(false);

  const { pw, cf } = { pw: form.password, cf: form.confirm };
  const strength = passwordStrength(pw);
  const pwValid = pw.length >= 8;
  const cfValid = cf === pw && cf.length > 0;
  const canSubmit = pwValid && cfValid;

  const handleSubmit = async () => {
    setOtpError("");
    setTouched({ pw: true, cf: true });
    if (!canSubmit) return;
    setLoading(true);
    if (form.password !== form.confirm) {
      alert("Password did not matched");
    }

    const code = Number(form.code.join(""));
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/users/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, code }),
      },
    );
    const data = await res.json();

    if (data.message == "Invalid 2FA code") {
      setOtpError("Invalid 2FA code");
      setLoading(false);
      onBack();
      return;
    }

    if (data.message == "Password reset successful") {
      setLoading(false);
      onNext();
      return;
    }
    setLoading(false);
    // setTimeout(() => {
    //   setLoading(false);
    //   onNext();
    // }, 1200);
  };

  return (
    <div className="card">
      <div className="icon-header">
        <div className="icon-bubble key">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle
              cx="8"
              cy="8"
              r="5"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M13 13l8 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M17 17l2-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <h2 className="card-title">Create New Password</h2>
      <p className="card-sub">
        Your identity is verified. Set a strong new password for your account.
      </p>

      <Stepper current={3} />
      <div className="section-divider" />

      {/* Password */}
      <div className="field-group">
        <label className="field-label" htmlFor="fp-pw">
          New Password
        </label>
        <div
          className={`input-wrap ${touched.pw && !pwValid ? "input-error" : touched.pw && pwValid ? "input-success" : ""}`}
        >
          <svg className="input-icon" viewBox="0 0 20 20" fill="none">
            <rect
              x="3"
              y="9"
              width="14"
              height="9"
              rx="2"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <path
              d="M7 9V6a3 3 0 016 0v3"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="fp-pw"
            type={showPw ? "text" : "password"}
            className="text-input has-icon has-toggle"
            placeholder="Min. 8 characters"
            value={pw}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            onBlur={() => setTouched((t) => ({ ...t, pw: true }))}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="toggle-eye"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff /> : <EyeOn />}
          </button>
        </div>
        {touched.pw && !pwValid && (
          <p className="field-error">Password must be at least 8 characters.</p>
        )}
      </div>

      {/* Strength bar */}
      {pw.length > 0 && (
        <div className="strength-wrap">
          <div className="strength-bars">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="strength-bar"
                style={{
                  background:
                    i <= strength.score ? strength.color : "var(--border)",
                }}
              />
            ))}
          </div>
          <span className="strength-label" style={{ color: strength.color }}>
            {strength.label}
          </span>
        </div>
      )}

      {/* Requirements */}
      {pw.length > 0 && (
        <ul className="pw-requirements">
          <Req met={pw.length >= 8} text="At least 8 characters" />
          <Req met={hasUppercase(pw)} text="One uppercase letter" />
          <Req met={hasNumber(pw)} text="One number" />
          <Req met={hasSpecial(pw)} text="One special character" />
        </ul>
      )}

      {/* Confirm */}
      <div className="field-group" style={{ marginTop: 18 }}>
        <label className="field-label" htmlFor="fp-cf">
          Confirm Password
        </label>
        <div
          className={`input-wrap ${touched.cf && !cfValid ? "input-error" : touched.cf && cfValid ? "input-success" : ""}`}
        >
          <svg className="input-icon" viewBox="0 0 20 20" fill="none">
            <rect
              x="3"
              y="9"
              width="14"
              height="9"
              rx="2"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <path
              d="M7 9V6a3 3 0 016 0v3"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="fp-cf"
            type={showCf ? "text" : "password"}
            className="text-input has-icon has-toggle"
            placeholder="Re-enter password"
            value={cf}
            onChange={(e) =>
              setForm((f) => ({ ...f, confirm: e.target.value }))
            }
            onBlur={() => setTouched((t) => ({ ...t, cf: true }))}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="toggle-eye"
            onClick={() => setShowCf((v) => !v)}
            aria-label={showCf ? "Hide" : "Show"}
          >
            {showCf ? <EyeOff /> : <EyeOn />}
          </button>
        </div>
        {touched.cf && !cfValid && cf.length > 0 && (
          <p className="field-error">Passwords do not match.</p>
        )}
      </div>

      <div className="btn-row" style={{ marginTop: 24 }}>
        <button className="btn-outline" onClick={onBack}>
          Back
        </button>
        <button
          className={`btn-primary ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner /> Saving…
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 4 – Success ─────────────────────────────────────────────────────────

function StepSuccess({ onDone }: { onDone: () => void }) {
  return (
    <div className="card success-card">
      <div className="success-anim">
        <svg className="success-ring" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="#dcfce7" strokeWidth="8" />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#16a34a"
            strokeWidth="8"
            strokeDasharray="226"
            strokeDashoffset="0"
            strokeLinecap="round"
            className="ring-fill"
          />
          <path
            d="M25 40l10 10 20-18"
            stroke="#16a34a"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-draw"
          />
        </svg>
      </div>

      <h2 className="card-title" style={{ textAlign: "center" }}>
        Password Reset!
      </h2>
      <p className="card-sub" style={{ textAlign: "center" }}>
        Your password has been updated successfully.
        <br />
        You can now sign in with your new credentials.
      </p>

      <button
        className="btn-primary full"
        style={{ marginTop: 8 }}
        onClick={onDone}
      >
        Back to Sign In
      </button>

      <p className="success-note">
        Didn&apos;t make this change?{" "}
        <a href="#" className="link" onClick={(e) => e.preventDefault()}>
          Contact support
        </a>
      </p>
    </div>
  );
}

// ─── Small Components ─────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="spinner"
      viewBox="0 0 24 24"
      fill="none"
      width="16"
      height="16"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="3"
      />
      <path
        d="M12 2a10 10 0 0110 10"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Req({ met, text }: { met: boolean; text: string }) {
  return (
    <li className={`pw-req ${met ? "met" : ""}`}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        {met ? (
          <>
            <circle cx="7" cy="7" r="7" fill="#22c55e" />
            <path
              d="M4 7l2 2 4-4"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <circle cx="7" cy="7" r="6" stroke="#cbd5e1" strokeWidth="1.5" />
        )}
      </svg>
      {text}
    </li>
  );
}

function EyeOn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 12C3.5 6 8 3 12 3s8.5 3 11 9c-2.5 6-7 9-11 9S3.5 18 1 12z"
        stroke="#94a3b8"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="#94a3b8" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-4 0-8.5-3-11-9 1.18-2.7 2.9-4.82 5-6.18M9.9 4.24A9.12 9.12 0 0112 4c4 0 8.5 3 11 9a17.46 17.46 0 01-2.34 3.76M3 3l18 18"
        stroke="#94a3b8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ForgotPassword() {
  const { timeLeft, isActive, startCooldown } = useCooldownTimer(
    60000,
    "forgot-password-2fa-cooldown",
  );
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [otpError, setOtpError] = useState<string>("");
  const next = () => setStep((s) => Math.min(s + 1, 4) as Step);
  const back = () => setStep((s) => Math.max(s - 1, 1) as Step);
  const router = useRouter();
  const reset = () => {
    setStep(1);
    setForm(DEFAULT_FORM);
    router.push("/login");
  };

  return (
    <>
      <GlobalStyles />
      <div className="page-wrapper">
        {/* Left decorative panel (desktop only) */}
        {/* <div className="deco-panel" aria-hidden="true">
          <div className="deco-content">
            <div className="deco-logo">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect
                  width="36"
                  height="36"
                  rx="10"
                  fill="white"
                  fillOpacity=".15"
                />
                <path
                  d="M10 18h16M18 10v16"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="6"
                  stroke="white"
                  strokeWidth="2"
                  strokeOpacity=".5"
                />
              </svg>
              <span className="deco-brand">ShipTrack</span>
            </div>
            <h1 className="deco-headline">Account Security</h1>
            <p className="deco-sub">
              We use 2-factor email verification to make sure only you can reset
              your password.
            </p>
            <div className="deco-steps">
              {[
                {
                  icon: "📧",
                  t: "Request reset",
                  d: "Enter your account email address",
                },
                {
                  icon: "🔐",
                  t: "Verify identity",
                  d: "Enter the 6-digit code we email you",
                },
                {
                  icon: "🔑",
                  t: "Set new password",
                  d: "Create a strong, unique password",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`deco-step ${step > i ? "deco-done" : step === i + 1 ? "deco-active" : ""}`}
                >
                  <span className="deco-step-icon">{s.icon}</span>
                  <div>
                    <strong>{s.t}</strong>
                    <span>{s.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="deco-blob blob1" />
          <div className="deco-blob blob2" />
        </div> */}

        {/* Form Panel */}
        <div className="form-panel">
          <div className="form-inner">
            {step === 1 && (
              <StepEmail
                startCooldown={startCooldown}
                form={form}
                setForm={setForm}
                onNext={next}
              />
            )}
            {step === 2 && (
              <StepVerify
                isActive={isActive}
                timeLeft={timeLeft}
                form={form}
                otpError={otpError}
                setForm={setForm}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 3 && (
              <StepReset
                setOtpError={setOtpError}
                form={form}
                setForm={setForm}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 4 && <StepSuccess onDone={reset} />}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --brand:        #1e40af;
        --brand-dark:   #1d3a9e;
        --brand-light:  #eff6ff;
        --brand-ring:   rgba(30,64,175,0.12);

        --text-primary:   #0f172a;
        --text-secondary: #475569;
        --text-muted:     #94a3b8;

        --border:     #e2e8f0;
        --border-focus:#93c5fd;
        --surface:    #f8fafc;
        --card-bg:    #ffffff;
        --bg:         #f0f4f8;

        --error:      #ef4444;
        --success:    #22c55e;

        --radius-md:  10px;
        --radius-lg:  14px;
        --radius-xl:  20px;

        --shadow-card: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
        --shadow-drop: 0 10px 30px rgba(0,0,0,0.10);

        --font: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

        --text-xs:   clamp(11px, 1.8vw, 12px);
        --text-sm:   clamp(12px, 2vw,   13px);
        --text-base: clamp(14px, 2.2vw, 15px);
        --text-md:   clamp(15px, 2.5vw, 16px);
        --text-xl:   clamp(20px, 3.5vw, 24px);
      }

      html { font-size: 16px; -webkit-text-size-adjust: 100%; }
      body { font-family: var(--font); background: var(--bg); color: var(--text-primary); min-height: 100vh; line-height: 1.5; }

      /* ── Page Layout ── */
      .page-wrapper {
        display: flex;
        min-height: 100vh;
      }

      /* ── Decorative Left Panel ── */
      .deco-panel {
        display: none; /* hidden on mobile */
        position: relative;
        flex: 0 0 420px;
        background: linear-gradient(155deg, #1e3a8a 0%, #1e40af 45%, #2563eb 100%);
        overflow: hidden;
        padding: 48px 40px;
      }

      .deco-content {
        position: relative;
        z-index: 2;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 32px;
      }

      .deco-logo {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .deco-brand {
        font-size: 20px;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.3px;
      }

      .deco-headline {
        font-size: clamp(26px, 3vw, 34px);
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.5px;
        line-height: 1.2;
        margin-top: auto;
      }

      .deco-sub {
        font-size: 15px;
        color: rgba(255,255,255,0.72);
        line-height: 1.6;
        max-width: 300px;
      }

      .deco-steps {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 8px;
        padding-bottom: 48px;
      }

      .deco-step {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 14px 16px;
        border-radius: var(--radius-md);
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        transition: background 0.3s, border-color 0.3s;
      }

      .deco-step.deco-active {
        background: rgba(255,255,255,0.16);
        border-color: rgba(255,255,255,0.3);
      }

      .deco-step.deco-done {
        opacity: 0.55;
      }

      .deco-step-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }

      .deco-step strong {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 2px;
      }

      .deco-step span {
        font-size: 12px;
        color: rgba(255,255,255,0.65);
        line-height: 1.4;
      }

      .deco-blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.25;
        pointer-events: none;
      }

      .blob1 {
        width: 300px; height: 300px;
        background: #60a5fa;
        top: -80px; right: -80px;
      }

      .blob2 {
        width: 240px; height: 240px;
        background: #93c5fd;
        bottom: 60px; left: -60px;
      }

      /* ── Form Panel ── */
      .form-panel {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: clamp(16px, 5vw, 56px) clamp(12px, 4vw, 32px);
        background: var(--bg);
      }

      .form-inner {
        width: 100%;
        max-width: 460px;
      }

      /* ── Card ── */
      .card {
        background: var(--card-bg);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border);
        padding: clamp(22px, 5vw, 40px);
        box-shadow: var(--shadow-card);
        animation: slideUp 0.28s cubic-bezier(0.22,1,0.36,1) both;
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ── Icon Header ── */
      .icon-header { margin-bottom: 18px; }

      .icon-bubble {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        background: var(--brand-light);
        color: var(--brand);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s;
      }

      .icon-bubble.shield { background: #f0fdf4; color: #16a34a; }
      .icon-bubble.key    { background: #fefce8; color: #ca8a04; }

      .card-title {
        font-size: var(--text-xl);
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: -0.4px;
        margin-bottom: 8px;
      }

      .card-sub {
        font-size: var(--text-base);
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 20px;
      }

      /* ── Stepper (same as shipment form) ── */
      .stepper { display: flex; align-items: center; width: 100%; }

      .step-item { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }

      .step-circle {
        width: clamp(30px, 7vw, 36px);
        height: clamp(30px, 7vw, 36px);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--text-sm);
        font-weight: 700;
        transition: background 0.25s;
        flex-shrink: 0;
      }

      .step-circle.active { background: var(--brand); color: #fff; box-shadow: 0 0 0 4px var(--brand-ring); }
      .step-circle.done   { background: var(--brand); color: #fff; }
      .step-circle.idle   { background: var(--surface); color: var(--text-muted); border: 1.5px solid var(--border); }

      .step-label { font-size: var(--text-xs); color: var(--text-muted); font-weight: 500; }
      .step-label.active-label { color: var(--brand); font-weight: 700; }
      .step-label.done-label   { color: var(--brand); opacity: 0.7; }

      .step-connector {
        flex: 1;
        height: 2px;
        background: var(--border);
        margin: 0 4px;
        margin-bottom: clamp(16px, 4vw, 22px);
        border-radius: 2px;
        transition: background 0.35s;
        min-width: 8px;
      }

      .step-connector.done-line { background: var(--brand); }

      .section-divider { height: 1px; background: var(--border); margin: clamp(14px, 3vw, 20px) 0; }

      /* ── Fields ── */
      .field-group { display: flex; flex-direction: column; }

      .field-label {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        font-weight: 500;
        margin-bottom: 6px;
      }

      .input-wrap {
        position: relative;
        display: flex;
        align-items: center;
        border: 1.5px solid var(--border);
        border-radius: var(--radius-md);
        background: #fff;
        transition: border-color 0.2s, box-shadow 0.2s;
        min-height: 48px;
      }

      .input-wrap:focus-within { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-ring); }
      .input-wrap.input-error  { border-color: var(--error); }
      .input-wrap.input-error:focus-within { box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
      .input-wrap.input-success { border-color: var(--success); }

      .input-icon {
        position: absolute;
        left: 13px;
        width: 18px;
        height: 18px;
        pointer-events: none;
        flex-shrink: 0;
      }

      .text-input {
        flex: 1;
        padding: clamp(11px, 2.5vw, 13px) 14px;
        font-size: var(--text-base);
        font-family: var(--font);
        border: none;
        outline: none;
        background: transparent;
        color: var(--text-primary);
        min-width: 0;
      }

      .text-input.has-icon  { padding-left: 42px; }
      .text-input.has-toggle { padding-right: 44px; }

      .text-input::placeholder { color: var(--text-muted); }

      .input-status-icon {
        position: absolute;
        right: 13px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      .toggle-eye {
        position: absolute;
        right: 10px;
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 6px;
        border-radius: 6px;
        color: var(--text-muted);
        transition: color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }

      .toggle-eye:hover { color: var(--text-secondary); }

      .field-error {
        font-size: var(--text-xs);
        color: var(--error);
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* ── OTP Boxes ── */
      .otp-row {
        display: flex;
        gap: clamp(6px, 2.5vw, 12px);
        justify-content: center;
      }

      .otp-box {
        width: clamp(42px, 12vw, 56px);
        height: clamp(48px, 14vw, 62px);
        border: 1.5px solid var(--border);
        border-radius: var(--radius-md);
        text-align: center;
        font-size: clamp(18px, 4vw, 24px);
        font-weight: 700;
        font-family: var(--font);
        color: var(--text-primary);
        background: #fff;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s, transform 0.1s;
        caret-color: transparent;
        -webkit-tap-highlight-color: transparent;
      }

      .otp-box:focus {
        border-color: var(--brand);
        box-shadow: 0 0 0 3px var(--brand-ring);
        transform: scale(1.05);
      }

      .otp-box.otp-filled {
        border-color: var(--brand);
        background: var(--brand-light);
        color: var(--brand);
      }

      .otp-box.otp-error {
        border-color: var(--error);
        background: #fef2f2;
        animation: shake 0.35s ease both;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-5px); }
        40%       { transform: translateX(5px); }
        60%       { transform: translateX(-4px); }
        80%       { transform: translateX(4px); }
      }

      .otp-hint {
        text-align: center;
        font-size: var(--text-sm);
        color: var(--text-muted);
        margin-top: 14px;
      }

      /* ── Strength Bar ── */
      .strength-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
      }

      .strength-bars {
        display: flex;
        gap: 4px;
        flex: 1;
      }

      .strength-bar {
        flex: 1;
        height: 4px;
        border-radius: 99px;
        transition: background 0.3s;
      }

      .strength-label {
        font-size: var(--text-xs);
        font-weight: 600;
        min-width: 64px;
        text-align: right;
        transition: color 0.3s;
      }

      /* ── Password Requirements ── */
      .pw-requirements {
        list-style: none;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px 12px;
        margin-top: 12px;
      }

      .pw-req {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: var(--text-xs);
        color: var(--text-muted);
        transition: color 0.2s;
      }

      .pw-req.met { color: var(--text-secondary); }

      /* ── Buttons ── */
      .btn-row {
        display: flex;
        gap: 10px;
      }

      .btn-primary,
      .btn-outline {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border-radius: var(--radius-md);
        font-size: var(--text-base);
        font-weight: 600;
        font-family: var(--font);
        cursor: pointer;
        transition: background 0.18s, transform 0.1s, box-shadow 0.18s;
        min-height: 48px;
        padding: 0 clamp(14px, 3.5vw, 22px);
        white-space: nowrap;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .btn-primary {
        flex: 1;
        background: var(--brand);
        color: #fff;
        border: none;
        box-shadow: 0 1px 3px rgba(30,64,175,0.3);
      }

      .btn-primary.full { width: 100%; margin-top: 18px; }

      .btn-primary:hover:not(:disabled) {
        background: var(--brand-dark);
        box-shadow: 0 4px 12px rgba(30,64,175,0.35);
      }

      .btn-primary:active:not(:disabled) { transform: scale(0.97); }

      .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

      .btn-outline {
        flex: 0 0 auto;
        background: #fff;
        color: var(--text-primary);
        border: 1.5px solid var(--border);
        min-width: 80px;
      }

      .btn-outline:hover { background: var(--surface); border-color: #cbd5e1; }
      .btn-outline:active { transform: scale(0.97); }

      .btn-link {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        font-family: var(--font);
        font-size: inherit;
      }

      /* ── Links ── */
      .link {
        color: var(--brand);
        text-decoration: none;
        font-weight: 600;
        transition: opacity 0.15s;
      }

      .link:hover { opacity: 0.75; text-decoration: underline; }

      .back-link {
        text-align: center;
        font-size: var(--text-sm);
        color: var(--text-muted);
        margin-top: 16px;
      }

      /* ── Spinner ── */
      .spinner { animation: spin 0.7s linear infinite; flex-shrink: 0; }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* ── Success ── */
      .success-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 14px;
      }

      .success-anim {
        width: clamp(64px, 18vw, 88px);
        height: clamp(64px, 18vw, 88px);
        margin-bottom: 4px;
      }

      .success-ring { width: 100%; height: 100%; }

      .ring-fill {
        stroke-dasharray: 226;
        stroke-dashoffset: 226;
        animation: ringFill 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s forwards;
        transform-origin: center;
        transform: rotate(-90deg);
      }

      @keyframes ringFill {
        to { stroke-dashoffset: 0; }
      }

      .check-draw {
        stroke-dasharray: 50;
        stroke-dashoffset: 50;
        animation: checkDraw 0.4s ease 0.75s forwards;
      }

      @keyframes checkDraw {
        to { stroke-dashoffset: 0; }
      }

      .success-note {
        font-size: var(--text-xs);
        color: var(--text-muted);
        margin-top: 8px;
      }

      /* ══════════════════════════════════
         RESPONSIVE BREAKPOINTS
      ══════════════════════════════════ */

      /* Show left panel on tablets landscape + desktop */
      @media (min-width: 900px) {
        .deco-panel { display: flex; flex-direction: column; }
      }

      /* Wide desktop */
      @media (min-width: 1280px) {
        .deco-panel { flex: 0 0 460px; }
        .form-inner { max-width: 480px; }
      }

      /* Tablets portrait 600–899 */
      @media (min-width: 600px) and (max-width: 899px) {
        .form-panel { padding: 40px 32px; }
        .form-inner { max-width: 480px; }
      }

      /* Small phones < 380px */
      @media (max-width: 379px) {
        .card { padding: 18px 14px; }
        .otp-row { gap: 5px; }
        .otp-box { width: 38px; height: 44px; font-size: 18px; }
        .pw-requirements { grid-template-columns: 1fr; }
        .btn-row { flex-direction: column-reverse; }
        .btn-outline { width: 100%; min-width: unset; }
        .step-label { display: none; }
      }

      /* Standard phones 380–599 */
      @media (min-width: 380px) and (max-width: 599px) {
        .form-panel { padding: 16px 14px 40px; }
        .btn-row:not(.single) { flex-direction: column-reverse; }
        .btn-outline { width: 100%; min-width: unset; }
      }

      /* Landscape phones */
      @media (max-height: 520px) and (orientation: landscape) {
        .form-panel { padding: 10px 20px; align-items: flex-start; }
        .card { padding: 18px 22px; }
        .section-divider { margin: 10px 0; }
        .icon-header { margin-bottom: 10px; }
        .icon-bubble { width: 40px; height: 40px; border-radius: 10px; }
        .card-sub { margin-bottom: 12px; font-size: 13px; }
        .step-label { display: none; }
      }

      /* Touch: bigger tap targets */
      @media (hover: none) and (pointer: coarse) {
        .btn-primary, .btn-outline { min-height: 52px; }
        .otp-box { min-height: 52px; }
        .text-input { min-height: 52px; }
        .toggle-eye { padding: 10px; }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .card { animation: none; }
        .otp-box { transition: border-color 0.01ms; }
        .otp-box.otp-error { animation: none; }
        .ring-fill, .check-draw { animation: none; stroke-dashoffset: 0; }
        .spinner { animation: none; }
        * { transition-duration: 0.01ms !important; }
      }

      /* Dark mode */
      @media (prefers-color-scheme: light) {
        :root {
          --bg:         #0f172a;
          --card-bg:    #1e293b;
          --surface:    #263347;
          --border:     #334155;
          --border-focus:#3b82f6;
          --text-primary:   #f1f5f9;
          --text-secondary: #94a3b8;
          --text-muted:     #64748b;
          --brand:       #3b82f6;
          --brand-dark:  #2563eb;
          --brand-light: rgba(59,130,246,0.12);
          --brand-ring:  rgba(59,130,246,0.2);
        }

        .input-wrap  { background: #1e293b; }
        .text-input  { color: #f1f5f9; }
        .otp-box     { background: #1e293b; color: #f1f5f9; border-color: #334155; }
        .otp-box.otp-filled { background: rgba(59,130,246,0.15); color: #93c5fd; border-color: #3b82f6; }
        .otp-box.otp-error  { background: rgba(239,68,68,0.1); }
        .btn-outline { background: #1e293b; color: #f1f5f9; border-color: #334155; }
        .btn-outline:hover { background: #263347; }
        .deco-panel  { background: linear-gradient(155deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%); }
      }

      /* Print */
      @media print {
        .deco-panel { display: none; }
        .form-panel { padding: 0; }
        .card { box-shadow: none; border: 1px solid #000; }
        .btn-row, .btn-primary.full, .back-link { display: none; }
      }
    `}</style>
  );
}
