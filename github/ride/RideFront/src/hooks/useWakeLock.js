import { useEffect } from "react";

// Keeps the screen on while a trip is live, so live tracking and navigation do not stop
// when the phone dims. Best effort: unsupported browsers simply ignore it.
export default function useWakeLock(active) {
  useEffect(() => {
    if (!active || !navigator.wakeLock) return undefined;
    let lock;
    let cancelled = false;
    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request("screen");
        if (cancelled) lock.release();
      } catch {
        /* denied or unavailable */
      }
    };
    acquire();
    // The browser releases the lock when the tab is hidden; take it again on return.
    const onVisible = () => document.visibilityState === "visible" && acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => {});
    };
  }, [active]);
}
