"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const COUNTDOWN = 10;

export default function NotFound() {
  const router = useNavigate();
  const [seconds, setSeconds] = useState(COUNTDOWN);

  useEffect(() => {
    if (seconds <= 0) {
      router("/");
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, router]);

  const progress = ((COUNTDOWN - seconds) / COUNTDOWN) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --brand:      #1e40af;
          --brand-dark: #1d3a9e;
          --brand-lt:   #eff6ff;
          --brand-ring: rgba(30,64,175,0.13);
          --t1: #0f172a;
          --t2: #475569;
          --t3: #94a3b8;
          --border: #e2e8f0;
          --surface: #f8fafc;
          --bg: #f1f5f9;
          --font: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        html, body { height: 100%; }

        body {
          font-family: var(--font);
          background: var(--bg);
          color: var(--t1);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Page ── */
        .nf-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(20px, 5vw, 48px) clamp(16px, 4vw, 24px);
          position: relative;
        }

        /* ── Background decoration ── */
        .nf-bg-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.08;
          animation: blobFloat 8s ease-in-out infinite;
        }
        .nf-blob1 {
          width: clamp(280px, 50vw, 600px);
          height: clamp(280px, 50vw, 600px);
          background: #1e40af;
          top: -10%;
          left: -10%;
          animation-delay: 0s;
        }
        .nf-blob2 {
          width: clamp(200px, 40vw, 480px);
          height: clamp(200px, 40vw, 480px);
          background: #3b82f6;
          bottom: -5%;
          right: -8%;
          animation-delay: 3s;
        }

        @keyframes blobFloat {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50%       { transform: scale(1.08) translate(12px, -12px); }
        }

        /* ── Card ── */
        .nf-card {
          position: relative;
          z-index: 2;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: clamp(16px, 3vw, 24px);
          padding: clamp(32px, 7vw, 64px) clamp(24px, 6vw, 56px);
          max-width: 520px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
          box-shadow:
            0 4px 6px -1px rgba(0,0,0,0.06),
            0 2px 4px -2px rgba(0,0,0,0.04);
          animation: cardIn 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── 404 number ── */
        .nf-404 {
          font-size: clamp(80px, 20vw, 128px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -4px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          user-select: none;
          margin-bottom: clamp(10px, 3vw, 16px);
          animation: numIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }

        @keyframes numIn {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ── Illustration ── */
        .nf-illustration {
          width: clamp(56px, 14vw, 76px);
          height: clamp(56px, 14vw, 76px);
          background: var(--brand-lt);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand);
          margin-bottom: clamp(16px, 4vw, 24px);
          animation: iconIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.18s both;
          box-shadow: 0 0 0 8px rgba(30,64,175,0.06);
        }

        @keyframes iconIn {
          from { opacity: 0; transform: scale(0.6) rotate(-10deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        /* ── Copy ── */
        .nf-title {
          font-size: clamp(20px, 4vw, 26px);
          font-weight: 800;
          color: var(--t1);
          letter-spacing: -0.5px;
          margin-bottom: 10px;
          animation: textIn 0.5s ease 0.22s both;
        }

        .nf-desc {
          font-size: clamp(14px, 2.5vw, 15px);
          color: var(--t2);
          line-height: 1.65;
          max-width: 360px;
          animation: textIn 0.5s ease 0.28s both;
        }

        @keyframes textIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Divider ── */
        .nf-divider {
          width: 100%;
          height: 1px;
          background: var(--border);
          margin: clamp(20px, 4.5vw, 30px) 0;
          animation: textIn 0.5s ease 0.32s both;
        }

        /* ── Countdown block ── */
        .nf-countdown-block {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          animation: textIn 0.5s ease 0.36s both;
          margin-bottom: clamp(20px, 4.5vw, 30px);
        }

        .nf-countdown-text {
          font-size: clamp(13px, 2.3vw, 14px);
          color: var(--t3);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nf-countdown-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--brand-lt);
          color: var(--brand);
          font-size: 15px;
          font-weight: 800;
          transition: transform 0.2s cubic-bezier(0.22,1,0.36,1),
                      background 0.2s;
          animation: numPulse 1s ease-in-out infinite;
        }

        @keyframes numPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.15); }
        }

        /* ── Progress bar ── */
        .nf-progress-track {
          width: 100%;
          max-width: 260px;
          height: 5px;
          background: var(--border);
          border-radius: 99px;
          overflow: hidden;
        }

        .nf-progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #1e40af, #3b82f6);
          transition: width 1s linear;
          position: relative;
          overflow: hidden;
        }

        .nf-progress-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
          animation: shine 1.2s ease-in-out infinite;
        }

        @keyframes shine {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%); }
        }

        /* ── Button ── */
        .nf-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          max-width: 280px;
          height: clamp(48px, 10vw, 54px);
          background: var(--brand);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: clamp(14px, 2.5vw, 15px);
          font-weight: 700;
          font-family: var(--font);
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(30,64,175,0.28), 0 1px 2px rgba(30,64,175,0.2);
          transition: background 0.18s, box-shadow 0.18s, transform 0.1s;
          -webkit-tap-highlight-color: transparent;
          animation: textIn 0.5s ease 0.4s both;
        }

        .nf-btn:hover {
          background: var(--brand-dark);
          box-shadow: 0 6px 18px rgba(30,64,175,0.36);
        }

        .nf-btn:active { transform: scale(0.97); }

        .nf-btn:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 3px;
        }

        /* ── Footer note ── */
        .nf-footer-note {
          margin-top: clamp(14px, 3vw, 20px);
          font-size: clamp(11px, 1.9vw, 12px);
          color: var(--t3);
          animation: textIn 0.5s ease 0.46s both;
        }

        /* ══════════════════════════════
           RESPONSIVE
        ══════════════════════════════ */

        @media (max-width: 399px) {
          .nf-card { padding: 28px 18px; }
          .nf-404  { letter-spacing: -2px; }
          .nf-illustration { border-radius: 16px; }
        }

        @media (max-height: 560px) and (orientation: landscape) {
          .nf-page { padding: 12px; }
          .nf-card { flex-wrap: wrap; padding: 20px 24px; max-width: 680px; }
          .nf-404  { font-size: 72px; width: 100%; }
          .nf-illustration { display: none; }
          .nf-title { font-size: 18px; }
          .nf-desc  { font-size: 13px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nf-card, .nf-404, .nf-illustration, .nf-title,
          .nf-desc, .nf-divider, .nf-countdown-block, .nf-btn,
          .nf-footer-note { animation: none; opacity: 1; }
          .nf-countdown-num { animation: none; }
          .nf-progress-fill { transition: width 1s linear; }
          .nf-progress-shine { animation: none; }
          .nf-bg-blob { animation: none; }
        }

        @media (prefers-color-scheme: light) {
          :root {
            --t1: #f1f5f9; --t2: #94a3b8; --t3: #64748b;
            --border: #2a3a52; --bg: #0b1220;
            --brand: #3b82f6; --brand-dark: #2563eb;
            --brand-lt: rgba(59,130,246,0.14);
          }
          body    { background: var(--bg); }
          .nf-card { background: #111d35; border-color: #2a3a52; }
        }
      `}</style>

      {/* Background blobs */}
      <div className="nf-bg-blob nf-blob1" aria-hidden="true" />
      <div className="nf-bg-blob nf-blob2" aria-hidden="true" />

      <div className="nf-page">
        <div className="nf-card" role="main">
          {/* 404 number */}
          <div className="nf-404" aria-label="Error 404">
            404
          </div>

          {/* Copy */}
          <p className="nf-desc text-center">
            The page you're looking for doesn't exist or has been moved. You'll
            be taken back to the homepage automatically.
          </p>

          <div className="nf-divider" aria-hidden="true" />

          {/* Countdown */}
          <div className="nf-countdown-block">
            <p className="nf-countdown-text">
              Redirecting in
              <span
                className="nf-countdown-num"
                aria-live="assertive"
                aria-label={`${seconds} seconds`}
              >
                {seconds}
              </span>
              {seconds === 1 ? "second" : "seconds"}…
            </p>

            <div
              className="nf-progress-track"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Redirect progress"
            >
              <div
                className="nf-progress-fill"
                style={{ width: `${progress}%` }}
              >
                <div className="nf-progress-shine" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* CTA button */}

          <p className="nf-footer-note text-center">
            © 2026 Feitsma Verhuizingen — Logistics Platform
          </p>
        </div>
      </div>
    </>
  );
}
