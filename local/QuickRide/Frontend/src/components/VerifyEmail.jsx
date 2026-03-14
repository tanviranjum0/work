/* eslint-disable react/prop-types */

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


import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCooldownTimer from "../hooks/useCooldownTimer";

function VerifyEmail({ user, role }) {

    const { isActive, timeLeft, startCooldown } = useCooldownTimer(60000, 'forgot-password-cooldown');
    const [sent, setSent] = useState(false);
    const navigation = useNavigate();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")


    const sendVerificationEmail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/mail/verify-${role}-email`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            if (response.status === 200) {
                startCooldown();
                setSent(true);
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <><style>{VERIFY_CSS}</style>

            <div className="min-h-screen flex flex-col font-body pt-16"
                style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#e8eeff 40%,#f0faf8 100%)" }}>
                <div className="fixed inset-0 pointer-events-none"
                    style={{ backgroundImage: "linear-gradient(rgba(26,86,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,255,.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
                <div className="fixed -top-40 -right-40 w-[500px] h-[500px] bg-blue-400 rounded-full opacity-8 blur-3xl pointer-events-none" />
                <div className="fixed bottom-0 -left-20 w-80 h-80 bg-teal-400 rounded-full opacity-6 blur-3xl pointer-events-none" />

                <div className="relative flex-1 flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md anim-fadeUpV">
                        <div className="text-center mb-8">
                            <button
                                onClick={() => navigation("/home")}
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

                                    </div>
                                </div>

                                {/* ── Heading ── */}
                                <div className="text-center mb-7">
                                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-2">
                                        {sent ? "Verification email sent!" : "Send Verification Email"}

                                    </h1>
                                    <p className="text-sm text-slate-500 font-body leading-relaxed max-w-xs mx-auto">
                                        {sent ? "Please check your inbox and confirm your email address." : " Click the button below to get a verification link."}

                                    </p>
                                </div>

                                {/* ── Email row ── */}
                                {!sent && <div className="mb-6">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-body mb-2 block">
                                        Email address
                                    </label>
                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                                        <span className="text-xl">✉️</span>
                                        <span className="flex-1 text-sm font-semibold text-slate-700 font-body truncate">{user.email}</span>

                                    </div>
                                </div>}
                                <p className="text-sm text-red-500 font-body text-center my-2">{error}</p>
                                {/* ════ PRE-SEND ════ */}
                                {!sent && (
                                    <>
                                        {/* SEND VERIFICATION NOW button */}
                                        <button
                                            onClick={sendVerificationEmail}
                                            disabled={loading || isActive}
                                            className={`w-full py-4 rounded-2xl font-bold text-white text-base font-body border-none transition-all duration-200 flex items-center justify-center gap-3 ${loading ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:-translate-y-0.5"}`}
                                            style={{ background: "linear-gradient(135deg,#1a56ff,#0f3fd4)", boxShadow: "0 14px 36px rgba(26,86,255,.32)" }}>

                                            {loading ? (
                                                <>
                                                    <span className="dot1 w-2 h-2 rounded-full bg-white inline-block" />
                                                    <span className="dot2 w-2 h-2 rounded-full bg-white inline-block" />
                                                    <span className="dot3 w-2 h-2 rounded-full bg-white inline-block" />
                                                    <span className="ml-1">Sending…</span>
                                                </>
                                            ) : (
                                                <>
                                                    {isActive ? `Resend in ${timeLeft}s` : <> <svg viewBox="0 0 20 20" className="w-5 h-5 fill-white shrink-0">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                        Send Verification Now</>}

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
            </div></>
    );
};

export default VerifyEmail







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
