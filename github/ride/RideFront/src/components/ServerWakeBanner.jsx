import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const HEALTH_URL = import.meta.env.VITE_SOCKET_URL ? `${import.meta.env.VITE_SOCKET_URL}/healthz` : null;

// Free API hosts sleep after idle time and need ~30-60 s to cold start. Poll the health
// endpoint on load (which also wakes it) and tell people what is happening instead of
// showing a screen that looks broken.
export default function ServerWakeBanner() {
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    if (!HEALTH_URL) return undefined;
    let cancelled = false;
    let slowTimer;
    let retryTimer;

    const check = async () => {
      const controller = new AbortController();
      const abort = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(HEALTH_URL, { signal: controller.signal, cache: "no-store" });
        if (response.ok) {
          clearTimeout(slowTimer);
          if (!cancelled) setWaking(false);
          return;
        }
      } catch {
        /* still asleep or offline */
      } finally {
        clearTimeout(abort);
      }
      if (!cancelled) retryTimer = setTimeout(check, 3000);
    };

    slowTimer = setTimeout(() => !cancelled && setWaking(true), 1500);
    check();
    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
      clearTimeout(retryTimer);
    };
  }, []);

  if (!waking) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        zIndex: "var(--z-toast)",
        left: 12,
        right: 12,
        bottom: "calc(12px + var(--safe-bottom))",
        margin: "0 auto",
        width: "fit-content",
        maxWidth: "calc(100% - 24px)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderRadius: 999,
        background: "var(--ink-900)",
        color: "#fff",
        boxShadow: "var(--shadow-lg)",
        fontSize: "var(--text-sm)",
        fontWeight: 600,
      }}
    >
      <Loader2 size={16} className="qr-spinner" style={{ border: 0 }} aria-hidden="true" />
      Waking up QuickRide… this can take up to a minute.
    </div>
  );
}
