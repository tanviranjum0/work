import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Console from "../utils/console";
// import mailImg from "/mail.png";
// import { Button, Spinner } from "../components";



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

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { userType } = useParams();
  const emailVerificationToken = searchParams.get("token");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/${userType}/verify-email`,
        { token: emailVerificationToken }
      );
      console.log(response.data)
      if (response.status === 200) {
        Console.log("Email verified successfully:", response.data);
        setResponse(`${response.data.email} is verified successfully. You can continue using the application.`);
      }
    } catch (error) {
      Console.error("Error verifying email:", error);
      if (error.response.data.message === "Token Expired") {
        setResponse("Your verification link is expired. Please request a new verification link.");
      } else if (error.response && error.response.data && error.response.data.message) {
        setResponse(error.response.data.message || "An error occurred while verifying your email.");
      } else {
        setResponse("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (emailVerificationToken) {
      verifyEmail();
    } else {
      setResponse("Invalid verification link.");
    }
  }, [emailVerificationToken]);
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
          {/* <p className="text-slate-500 font-body text-base leading-relaxed mb-7 max-w-xs mx-auto">
            <span className="font-semibold text-slate-700">{email}</span> is confirmed. Your account is fully active.
          </p> */}
          <p className="text-slate-500 font-body text-base leading-relaxed mb-7 max-w-xs mx-auto">{response}</p>

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
            disabled={loading}
            onClick={() => navigate(userType === 'captain' ? '/captain/home' : '/home')}
            className="w-full py-4 rounded-2xl font-bold text-white text-base font-body border-none cursor-pointer hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-teal-200/60 mb-3"
            style={{ background: "linear-gradient(135deg,#00c4a7,#00a38d)" }}>
            Start Exploring Swift →
          </button>
          <button
            disabled={loading}
            onClick={() => navigate("/login")}
            className="text-sm text-slate-400 font-body hover:text-slate-600 border-none bg-transparent cursor-pointer">
            Back to login
          </button>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
