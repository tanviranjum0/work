import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const HEALTH_URL = import.meta.env.VITE_SOCKET_URL
  ? `${import.meta.env.VITE_SOCKET_URL}/healthz`
  : null;

// Free API hosts sleep after idle time and take ~30-60s to cold start. Poll the health
// endpoint on load (which also wakes it) and tell the user instead of showing a dead UI.
function ServerWakeBanner() {
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    if (!HEALTH_URL) return undefined;
    let cancelled = false;
    let slowTimer;

    const check = async () => {
      const controller = new AbortController();
      const abort = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(HEALTH_URL, { signal: controller.signal, cache: "no-store" });
        if (res.ok) {
          clearTimeout(slowTimer);
          if (!cancelled) setWaking(false);
          return;
        }
      } catch {
        /* still asleep */
      } finally {
        clearTimeout(abort);
      }
      if (!cancelled) setTimeout(check, 3000);
    };

    slowTimer = setTimeout(() => !cancelled && setWaking(true), 1500);
    check();
    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
    };
  }, []);

  if (!waking) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%-32px)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-3 text-sm text-white shadow-2xl"
    >
      <Loader2 className="animate-spin shrink-0" size={18} />
      <span>Waking up the server — free hosting sleeps when idle. This takes up to a minute.</span>
    </div>
  );
}

export default ServerWakeBanner;
