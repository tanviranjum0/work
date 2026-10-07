import { useEffect, useState } from "react";

// Re-renders every `ms` so countdowns and "x min ago" labels stay current.
export default function useTick(ms = 1000, active = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms, active]);
  return now;
}
