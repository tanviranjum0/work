"use client";

import { motion, useTime, useTransform } from "framer-motion";

export function RotatingBox() {
  const time = useTime();
  // Map time → rotation angle (full spin every 2000ms)
  const rotate = useTransform(time, (t) => ((t / 2000) * 360) % 360);

  return (
    <motion.div
      style={{
        width: 100,
        height: 100,
        background: "tomato",
        borderRadius: 20,
        rotate,
      }}
    />
  );
}

export function PulseCircle() {
  const time = useTime();
  // Use sine wave: scale between 1 and 1.5
  const scale = useTransform(time, (t) => 1 + Math.sin(t / 300) * 0.5);

  return (
    <motion.div
      style={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: "hotpink",
        scale,
      }}
    />
  );
}

export function ProgressBar() {
  const time = useTime();
  // Loop width between 0% → 100% every 3 seconds
  const width = useTransform(time, (t) => `${(t % 3000) / 30}%`);

  return (
    <motion.div
      style={{
        width,
        height: 10,
        background: "limegreen",
      }}
    />
  );
}

export default function UseTime() {
  return (
    <>
      <h1>useTime</h1>
      <p>
        The <code>useTime</code> hook returns a continuously updating time value
        in milliseconds. This can be used to create animations that are based on
        the passage of time rather than user interaction or other events.
      </p>
      <h2>Rotating Box</h2>
      <p>
        This box rotates continuously, completing a full spin every 2 seconds.
      </p>
      <RotatingBox />
      <h2>Pulse Circle</h2>
      <p>
        This circle scales up and down in a pulsing effect using a sine wave
        function.
      </p>
      <PulseCircle />
      <h2>Progress Bar</h2>
      <p>This progress bar fills up from 0% to 100% every 3 seconds.</p>
      <ProgressBar />
    </>
  );
}
