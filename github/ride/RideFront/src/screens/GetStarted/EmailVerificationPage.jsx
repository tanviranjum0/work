/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════════════════════
   SWIFT — Email Verification Page
   Usage: <EmailVerificationPage onNavigate={fn} email="user@example.com" />
   Props:
     onNavigate(page) — called with "home" or "login" on completion / back
     email            — (optional) pre-fill the email field
══════════════════════════════════════════════════════════════════════════════ */

const VERIFY_CSS = `
  @keyframes emailFloat {
    0%,100% { transform: translateY(0px) rotate(-2deg); }
    50%      { transform: translateY(-14px) rotate(2deg); }
  }
  @keyframes dotBounce {
    0%,80%,100% { transform: translateY(0); }
    40%         { transform: translateY(-8px); }
  }
  @keyframes checkPop {
    0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
    60%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes ringPulse {
    0%   { transform: scale(1);   opacity: .5; }
    100% { transform: scale(1.7); opacity: 0;  }
  }
  @keyframes spinVerify { to { transform: rotate(360deg); } }
  @keyframes fadeUpV {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .font-display { font-family: &apos;Fraunces&apos;, serif; }
  .font-body    { font-family: &apos;Outfit&apos;, sans-serif; }

  .anim-emailFloat  { animation: emailFloat 4s ease-in-out infinite; }
  .anim-checkPop    { animation: checkPop .55s cubic-bezier(.34,1.56,.64,1) both; }
  .anim-ringPulse   { animation: ringPulse 1.8s ease-out infinite; }
  .anim-ringPulse2  { animation: ringPulse 1.8s .65s ease-out infinite; }
  .anim-fadeUpV     { animation: fadeUpV .5s ease both; }
  .anim-pulseDot    { animation: pulseDot 2s ease infinite; }

  @keyframes pulseDot {
    0%,100% { transform: scale(1); opacity: 1; }
    50%     { transform: scale(1.8); opacity: .4; }
  }

  .dot1 { animation: dotBounce 1.2s .0s ease-in-out infinite; }
  .dot2 { animation: dotBounce 1.2s .2s ease-in-out infinite; }
  .dot3 { animation: dotBounce 1.2s .4s ease-in-out infinite; }

  .verify-input:focus {
    outline: none;
    border-color: #1a56ff !important;
    box-shadow: 0 0 0 3px rgba(26,86,255,.12) !important;
  }
  .code-box:focus {
    outline: none;
    border-color: #1a56ff !important;
    box-shadow: 0 0 0 3px rgba(26,86,255,.14) !important;
    background: #fff !important;
  }
`;

/* ── Font injector ──────────────────────────────────────────────────────────── */
const injectFonts = () => {
    const id = "swift-fonts";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&display=swap";
    document.head.appendChild(l);
};

/* ── Envelope SVG ───────────────────────────────────────────────────────────── */
function EnvelopeIcon({ sent }) {
    return sent ? (
        <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
            <rect x="4" y="10" width="40" height="28" rx="4" fill="#dbeafe" stroke="#1a56ff" strokeWidth="2" />
            <path d="M4 14 L24 26 L44 14" stroke="#1a56ff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="36" cy="34" r="9" fill="#00c4a7" stroke="white" strokeWidth="2.5" />
            <path d="M31 34 L35 38 L41 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ) : (
        <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
            <rect x="4" y="10" width="40" height="28" rx="4" fill="#dbeafe" stroke="#1a56ff" strokeWidth="2" />
            <path d="M4 14 L24 26 L44 14" stroke="#1a56ff" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 38 L16 26 M44 38 L32 26" stroke="#1a56ff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/* ── Main Component ─────────────────────────────────────────────────────────── */
export default function EmailVerificationPage({ onNavigate, email: initialEmail = "you@example.com" }) {
    useEffect(() => { injectFonts(); }, []);

    /* ── State ── */
    const [email, setEmail] = useState(initialEmail);
    const [editingEmail, setEditingEmail] = useState(false);
    const [draftEmail, setDraftEmail] = useState(initialEmail);
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [verified, setVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [resendCount, setResendCount] = useState(0);
    const [cooldown, setCooldown] = useState(0);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [codeError, setCodeError] = useState("");

    /* ── Input refs for 6-digit boxes ── */
    const inputRefs = useState(() => Array.from({ length: 6 }, () => ({ current: null })))[0];

    /* ── Cooldown timer ── */
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    /* ── Handlers ── */
    const handleSend = () => {
        setSending(true);
        setTimeout(() => {
            setSending(false);
            setSent(true);
            setResendCount(n => n + 1);
            setCooldown(60);
            setCode(["", "", "", "", "", ""]);
            setCodeError("");
        }, 1800);
    };

    const handleCodeChange = (i, val) => {
        const digit = val.replace(/\D/g, "").slice(-1);
        const next = [...code];
        next[i] = digit;
        setCode(next);
        setCodeError("");
        if (digit && i < 5) inputRefs[i + 1]?.current?.focus();
    };

    const handleCodeKeyDown = (i, e) => {
        if (e.key === "Backspace" && !code[i] && i > 0) inputRefs[i - 1]?.current?.focus();
        if (e.key === "ArrowLeft" && i > 0) inputRefs[i - 1]?.current?.focus();
        if (e.key === "ArrowRight" && i < 5) inputRefs[i + 1]?.current?.focus();
    };

    const handleCodePaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setCode(pasted.split(""));
            inputRefs[5]?.current?.focus();
        }
        e.preventDefault();
    };

    const handleVerify = () => {
        if (code.join("").length < 6) { setCodeError("Please enter all 6 digits."); return; }
        setVerifying(true);
        setTimeout(() => { setVerifying(false); setVerified(true); }, 1800);
    };

    const saveEmail = () => {
        if (draftEmail.includes("@")) {
            setEmail(draftEmail);
            setEditingEmail(false);
            setSent(false);
            setCode(["", "", "", "", "", ""]);
            setCodeError("");
        }
    };

    /* ════════════════════════════════════════════════════════════════════════════
       SUCCESS SCREEN
    ════════════════════════════════════════════════════════════════════════════ */
    if (verified) {
        return (
            <>
                <style>{VERIFY_CSS}</style>
                <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-white flex flex-col items-center justify-center px-4 pt-16 pb-16 font-body">

                    {/* Background orbs */}
                    <div className="fixed -top-32 -right-32 w-80 h-80 bg-teal-300 rounded-full opacity-10 blur-3xl pointer-events-none" />
                    <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-blue-300 rounded-full opacity-8 blur-3xl pointer-events-none" />

                    <div className="relative w-full max-w-md text-center anim-fadeUpV">

                        {/* Animated check ring */}
                        <div className="relative inline-flex items-center justify-center mb-8">
                            <div className="absolute w-36 h-36 rounded-full bg-teal-400/15 anim-ringPulse" />
                            <div className="absolute w-36 h-36 rounded-full bg-teal-400/10 anim-ringPulse2" />
                            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl shadow-teal-200 anim-checkPop"
                                style={{ background: "linear-gradient(135deg,#00c4a7,#00a38d)" }}>
                                <svg viewBox="0 0 44 44" className="w-12 h-12" fill="none">
                                    <path d="M9 22 L19 32 L35 14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        {/* Status badge */}
                        <div className="inline-flex items-center gap-2 bg-teal-100 border border-teal-200 rounded-full px-4 py-1.5 mb-5">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 font-body">Email Verified</span>
                        </div>

                        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-3">
                            You&apos;re all set,<br /><em className="not-italic text-teal-600">welcome to Swift!</em>
                        </h1>
                        <p className="text-slate-500 font-body text-base leading-relaxed mb-7 max-w-xs mx-auto">
                            <span className="font-semibold text-slate-700">{email}</span> is confirmed. Your account is fully active.
                        </p>

                        {/* Unlocked features */}
                        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5 mb-7 text-left">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 font-body mb-3">What&apos;s now unlocked</p>
                            {[
                                ["🚗", "Book rides across 180+ cities"],
                                ["📡", "Real-time driver tracking"],
                                ["💳", "Save payment methods securely"],
                                ["🛡️", "Full safety features enabled"],
                                ["⭐", "Rate drivers & earn Swift Points"],
                            ].map(([ic, t]) => (
                                <div key={t} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                                    <span className="text-lg shrink-0">{ic}</span>
                                    <span className="text-sm text-slate-600 font-body flex-1">{t}</span>
                                    <span className="text-teal-500 font-bold text-sm shrink-0">✓</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => onNavigate("home")}
                            className="w-full py-4 rounded-2xl font-bold text-white text-base font-body border-none cursor-pointer hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-teal-200/60 mb-3"
                            style={{ background: "linear-gradient(135deg,#00c4a7,#00a38d)" }}>
                            Start Exploring Swift →
                        </button>
                        <button
                            onClick={() => onNavigate("login")}
                            className="text-sm text-slate-400 font-body hover:text-slate-600 border-none bg-transparent cursor-pointer">
                            Back to login
                        </button>
                    </div>
                </div>
            </>
        );
    }

    /* ════════════════════════════════════════════════════════════════════════════
       MAIN VERIFICATION PAGE
    ════════════════════════════════════════════════════════════════════════════ */
    return (
        <>
            <style>{VERIFY_CSS}</style>

            <div className="min-h-screen flex flex-col font-body pt-16"
                style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#e8eeff 40%,#f0faf8 100%)" }}>

                {/* Background decorations */}
                <div className="fixed inset-0 pointer-events-none"
                    style={{ backgroundImage: "linear-gradient(rgba(26,86,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,255,.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
                <div className="fixed -top-40 -right-40 w-[500px] h-[500px] bg-blue-400 rounded-full opacity-8 blur-3xl pointer-events-none" />
                <div className="fixed bottom-0 -left-20 w-80 h-80 bg-teal-400 rounded-full opacity-6 blur-3xl pointer-events-none" />

                <div className="relative flex-1 flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md anim-fadeUpV">

                        {/* ── Logo ── */}
                        <div className="text-center mb-8">
                            <button
                                onClick={() => onNavigate("home")}
                                className="inline-flex items-center gap-2.5 border-none bg-transparent cursor-pointer mb-5">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
                                    style={{ background: "linear-gradient(135deg,#1a56ff,#00c4a7)" }}>🚗</div>
                                <span className="font-display text-2xl font-bold text-slate-900">
                                    Swif<em className="text-blue-600 not-italic">t</em>
                                </span>
                            </button>

                            <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 anim-pulseDot" />
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 font-body">Email Verification</span>
                            </div>
                        </div>

                        {/* ── Card ── */}
                        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/50 border border-blue-50 overflow-hidden">

                            {/* Gradient top bar */}
                            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#1a56ff,#00c4a7)" }} />

                            <div className="p-7 sm:p-10">

                                {/* ── Floating envelope ── */}
                                <div className="flex justify-center mb-7">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-3xl border-2 border-blue-100 flex items-center justify-center shadow-lg anim-emailFloat"
                                            style={{ background: "linear-gradient(135deg,#dbeafe,#e0e7ff)" }}>
                                            <EnvelopeIcon sent={sent} />
                                        </div>
                                        {sent && (
                                            <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center shadow-md">
                                                <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none">
                                                    <path d="M2.5 7 L6 10.5 L11.5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ── Heading ── */}
                                <div className="text-center mb-7">
                                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-2">
                                        {sent ? "Check your inbox" : "Verify your email"}
                                    </h1>
                                    <p className="text-sm text-slate-500 font-body leading-relaxed max-w-xs mx-auto">
                                        {sent ? (
                                            <>A 6-digit code was sent to{" "}
                                                <span className="font-semibold text-slate-700">{email}</span>.
                                                {" "}Enter it below to activate your account.
                                            </>
                                        ) : (
                                            "Click the button below and we&apos;ll send a verification code straight to your inbox."
                                        )}
                                    </p>
                                </div>

                                {/* ── Email row ── */}
                                <div className="mb-6">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-body mb-2 block">
                                        Email address
                                    </label>

                                    {editingEmail ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                value={draftEmail}
                                                autoFocus
                                                onChange={e => setDraftEmail(e.target.value)}
                                                onKeyDown={e => { if (e.key === "Enter") saveEmail(); if (e.key === "Escape") setEditingEmail(false); }}
                                                className="verify-input flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 font-body transition-all duration-200"
                                                placeholder="your@email.com"
                                            />
                                            <button onClick={saveEmail}
                                                className="px-4 py-3 rounded-xl text-xs font-bold text-white font-body border-none cursor-pointer transition-colors"
                                                style={{ background: "#1a56ff" }}>
                                                Save
                                            </button>
                                            <button onClick={() => setEditingEmail(false)}
                                                className="px-4 py-3 rounded-xl text-xs font-bold text-slate-500 font-body border-none cursor-pointer bg-slate-100 hover:bg-slate-200 transition-colors">
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                                            <span className="text-xl">✉️</span>
                                            <span className="flex-1 text-sm font-semibold text-slate-700 font-body truncate">{email}</span>
                                            {!sent && (
                                                <button
                                                    onClick={() => { setDraftEmail(email); setEditingEmail(true); }}
                                                    className="text-xs font-bold text-blue-500 hover:text-blue-700 border-none bg-transparent cursor-pointer font-body shrink-0 transition-colors">
                                                    Change
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* ════ PRE-SEND ════ */}
                                {!sent && (
                                    <>
                                        {/* SEND VERIFICATION NOW button */}
                                        <button
                                            onClick={handleSend}
                                            disabled={sending}
                                            className={`w-full py-4 rounded-2xl font-bold text-white text-base font-body border-none transition-all duration-200 flex items-center justify-center gap-3 ${sending ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:-translate-y-0.5"}`}
                                            style={{ background: "linear-gradient(135deg,#1a56ff,#0f3fd4)", boxShadow: "0 14px 36px rgba(26,86,255,.32)" }}>
                                            {sending ? (
                                                <>
                                                    <span className="dot1 w-2 h-2 rounded-full bg-white inline-block" />
                                                    <span className="dot2 w-2 h-2 rounded-full bg-white inline-block" />
                                                    <span className="dot3 w-2 h-2 rounded-full bg-white inline-block" />
                                                    <span className="ml-1">Sending…</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg viewBox="0 0 20 20" className="w-5 h-5 fill-white shrink-0">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                    Send Verification Now
                                                </>
                                            )}
                                        </button>

                                        {/* Spam tip */}
                                        <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                            <span className="text-amber-500 text-base shrink-0 mt-0.5">💡</span>
                                            <p className="text-xs text-amber-700 font-body leading-relaxed">
                                                Check your <strong>spam / junk folder</strong> if you don&apos;t see the email within 2 minutes. Add{" "}
                                                <strong>no-reply@swift.app</strong> to your contacts for reliable delivery.
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* ════ POST-SEND: CODE ENTRY ════ */}
                                {sent && (
                                    <>
                                        {/* 6-digit boxes */}
                                        <div className="mb-5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-body mb-3 block text-center">
                                                Enter 6-digit code
                                            </label>

                                            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleCodePaste}>
                                                {code.map((digit, i) => (
                                                    <input
                                                        key={i}
                                                        ref={el => { inputRefs[i].current = el; }}
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={1}
                                                        value={digit}
                                                        onChange={e => handleCodeChange(i, e.target.value)}
                                                        onKeyDown={e => handleCodeKeyDown(i, e)}
                                                        className={`code-box rounded-2xl border-2 text-center font-display font-bold text-slate-900 transition-all duration-200 ${codeError
                                                            ? "border-red-300 bg-red-50"
                                                            : digit
                                                                ? "border-blue-400 bg-blue-50"
                                                                : "bg-slate-50 border-slate-200"
                                                            }`}
                                                        style={{ width: "2.85rem", height: "3.5rem", fontSize: "1.5rem" }}
                                                    />
                                                ))}
                                            </div>

                                            {codeError && (
                                                <p className="text-xs text-red-500 font-body text-center mt-2">{codeError}</p>
                                            )}
                                            <p className="text-xs text-slate-400 font-body text-center mt-2">
                                                Tip: you can paste the 6-digit code directly
                                            </p>
                                        </div>

                                        {/* Verify button */}
                                        <button
                                            onClick={handleVerify}
                                            disabled={verifying || code.join("").length < 6}
                                            className={`w-full py-4 rounded-2xl font-bold text-white text-base font-body border-none transition-all duration-200 flex items-center justify-center gap-2 ${verifying || code.join("").length < 6
                                                ? "opacity-55 cursor-not-allowed"
                                                : "cursor-pointer hover:-translate-y-0.5"
                                                }`}
                                            style={{ background: "linear-gradient(135deg,#1a56ff,#0f3fd4)", boxShadow: "0 12px 32px rgba(26,86,255,.28)" }}>
                                            {verifying ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full inline-block"
                                                        style={{ animation: "spinVerify 1s linear infinite" }} />
                                                    Verifying…
                                                </>
                                            ) : (
                                                <>
                                                    <svg viewBox="0 0 20 20" className="w-5 h-5 fill-white shrink-0">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Verify My Email
                                                </>
                                            )}
                                        </button>

                                        {/* Divider */}
                                        <div className="flex items-center gap-3 my-5">
                                            <div className="flex-1 h-px bg-slate-100" />
                                            <span className="text-xs text-slate-400 font-body">didn&apos;t receive it?</span>
                                            <div className="flex-1 h-px bg-slate-100" />
                                        </div>

                                        {/* Resend + Change email */}
                                        <div className="flex flex-col sm:flex-row gap-2.5">
                                            <button
                                                onClick={handleSend}
                                                disabled={cooldown > 0 || sending}
                                                className={`flex-1 py-3 rounded-xl font-bold text-sm font-body border-2 transition-all duration-200 flex items-center justify-center gap-2 ${cooldown > 0 || sending
                                                    ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                                                    : "border-blue-200 bg-white text-blue-600 cursor-pointer hover:bg-blue-50 hover:border-blue-400"
                                                    }`}>
                                                {sending ? (
                                                    <>
                                                        <span className="dot1 w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                                                        <span className="dot2 w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                                                        <span className="dot3 w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                                                    </>
                                                ) : cooldown > 0 ? (
                                                    <>⏳ Resend in {cooldown}s</>
                                                ) : (
                                                    <>🔄 {resendCount > 1 ? "Resend again" : "Resend code"}</>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setDraftEmail(email);
                                                    setEditingEmail(true);
                                                    setSent(false);
                                                    setCode(["", "", "", "", "", ""]);
                                                    setCodeError("");
                                                }}
                                                className="flex-1 py-3 rounded-xl font-bold text-sm font-body border-2 border-slate-200 bg-white text-slate-500 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2">
                                                ✏️ Change email
                                            </button>
                                        </div>

                                        {resendCount > 1 && (
                                            <p className="text-center text-xs text-slate-400 font-body mt-3">
                                                Sent {resendCount} times · Still having trouble?{" "}
                                                <span className="text-blue-500 cursor-pointer hover:underline">Contact support</span>
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── Progress stepper ── */}
                        <div className="flex justify-center items-center gap-3 mt-8">
                            {[
                                { n: "✓", label: "Account created", active: true, done: true },
                                { n: "2", label: "Verify email", active: true, done: false },
                                { n: "3", label: "Start riding", active: false, done: false },
                            ].map((s, i) => (
                                <div key={s.label} className="flex items-center gap-3">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-body transition-all duration-300 ${s.active ? "text-white shadow-md" : "bg-slate-200 text-slate-400"}`}
                                            style={s.active ? { background: "linear-gradient(135deg,#1a56ff,#0f3fd4)" } : {}}>
                                            {s.n}
                                        </div>
                                        <span className={`text-xs font-body whitespace-nowrap ${s.active ? "text-slate-700 font-semibold" : "text-slate-400"}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < 2 && (
                                        <div className={`w-8 sm:w-14 h-0.5 rounded-full mb-5 transition-all duration-500 ${i === 0 ? "bg-blue-400" : "bg-slate-200"}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* ── Trust strip ── */}
                        <div className="flex flex-wrap justify-center gap-6 mt-6 pb-4">
                            {[["🔒", "256-bit encrypted"], ["🛡️", "GDPR compliant"], ["📧", "Instant delivery"]].map(([ic, t]) => (
                                <div key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-body">
                                    <span>{ic}</span><span>{t}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}