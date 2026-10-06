import { useEffect, useState } from "react";

// Space covered by the floating booking panel, so fitted routes stay in the visible map area.
function compute() {
  const { innerWidth: w, innerHeight: h } = window;
  if (w > 640) return { top: 90, bottom: 70, left: Math.min(500, w * 0.5) + 30, right: 70 };
  return { top: 90, bottom: Math.round(h * 0.52), left: 30, right: 30 };
}

export default function useMapPadding() {
  const [padding, setPadding] = useState(compute);
  useEffect(() => {
    const onResize = () => setPadding(compute());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return padding;
}
