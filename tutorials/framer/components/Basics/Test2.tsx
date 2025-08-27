"use client";
import React, { useRef } from "react";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

type HoloDepthButtonProps = {
  label?: string;
  onClick?: () => void;
  width?: number; // px
  height?: number; // px
  accent?: string; // CSS color for edge glow
  secondary?: string; // CSS color for inner glow
  className?: string;
};

/**
 * HoloDepthButton
 * - 3D parallax tilt based on cursor (rotateX / rotateY)
 * - Specular highlight that tracks cursor
 * - Animated neon edge ring using conic gradient + mask
 * - Press depth: z "depression" and springy rebound
 * - Reduced-motion safe
 */
const HoloDepthButton: React.FC<HoloDepthButtonProps> = ({
  label = "LAUNCH",
  onClick,
  width = 260,
  height = 96,
  accent = "#00F5FF",
  secondary = "#8A5CFF",
  className = "",
}) => {
  const r = useRef<HTMLButtonElement | null>(null);
  const prefersReduced = useReducedMotion();

  // Cursor position (relative to center)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Tilt angles derived from cursor
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), {
    stiffness: 180,
    damping: 16,
    mass: 0.5,
  });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), {
    stiffness: 180,
    damping: 16,
    mass: 0.5,
  });

  // Depth (z) for press effect
  const press: MotionValue<number> = useSpring(0, {
    stiffness: 300,
    damping: 22,
  });

  // “Parallax” for inner layers
  const parallaxX = useTransform(mx, [-0.5, 0.5], [-8, 8]);
  const parallaxY = useTransform(my, [-0.5, 0.5], [-6, 6]);

  // Specular highlight follows cursor
  const highlightX = useTransform(mx, [-0.5, 0.5], ["20%", "80%"]);
  const highlightY = useTransform(my, [-0.5, 0.5], ["15%", "85%"]);
  const shine = useMotionTemplate`radial-gradient(120px 120px at ${highlightX} ${highlightY}, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 40%, transparent 60%)`;

  // Animated edge gradient
  const edge = useMotionTemplate`conic-gradient(from 0deg, ${accent}, ${secondary}, ${accent})`;

  const handlePointerMove: React.PointerEventHandler = (e) => {
    if (!r.current) return;
    const rect = r.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    mx.set(px - 0.5);
    my.set(py - 0.5);
  };

  const handlePointerLeave: React.PointerEventHandler = () => {
    mx.set(0);
    my.set(0);
  };

  const handlePointerDown: React.PointerEventHandler = () => {
    press.set(1);
  };
  const handlePointerUp: React.PointerEventHandler = () => {
    press.set(0);
  };

  // Reduced-motion fallback: gentle scale only
  const pressScale = useTransform(press, [0, 1], [1, 0.98]);
  const pressDepth = useTransform(press, [0, 1], [0, -6]);
  const transformStyle = prefersReduced
    ? useMotionTemplate`scale(${pressScale})`
    : useMotionTemplate`
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        translateZ(${pressDepth}px)
      `;

  return (
    <motion.button
      ref={r}
      aria-label={label}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={`relative select-none will-change-transform rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/40 ${className}`}
      style={{
        width,
        height,
        transformStyle: "preserve-3d",
        perspective: 1000,
        // Nice ambient background for demos; remove if you embed elsewhere
        background:
          "linear-gradient(135deg, rgba(10,11,20,0.9), rgba(10,11,20,0.9))",
      }}
      whileHover={{ scale: prefersReduced ? 1.02 : 1.01 }}
      whileTap={{ scale: prefersReduced ? 0.98 : 0.999 }}
    >
      {/* 3D container (tilt + press depth) */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          transform: transformStyle,
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Edge ring with animated conic gradient + mask to show only border */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-2xl"
          style={{
            background: edge,
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            padding: "2px",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            filter: "drop-shadow(0 0 12px rgba(0,245,255,0.35))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Base plate (subtle texture) */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.25))",
          }}
        />

        {/* Parallax inner glow */}
        <motion.div
          aria-hidden
          className="absolute rounded-xl"
          style={{
            inset: 6,
            translateX: parallaxX,
            translateY: parallaxY,
            borderRadius: 14,
            background:
              "radial-gradient(70% 120% at 50% 10%, rgba(0,245,255,0.25), rgba(138,92,255,0.18) 40%, rgba(0,0,0,0) 65%)",
            boxShadow:
              "inset 0 0 32px rgba(0,245,255,0.25), inset 0 0 16px rgba(138,92,255,0.25)",
          }}
        />

        {/* Dynamic specular highlight that tracks cursor */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-screen"
          style={{ background: shine }}
        />

        {/* Label layer (slight parallax opposite to inner glow for depth) */}
        <motion.span
          className="absolute inset-0 grid place-items-center font-extrabold tracking-[0.18em] uppercase"
          style={{
            translateX: useTransform(parallaxX, (v) => v * -0.5),
            translateY: useTransform(parallaxY, (v) => v * -0.5),
            background: "linear-gradient(90deg, #ffffff, #c8f7ff 60%, #e3d4ff)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow:
              "0 1px 0 rgba(0,0,0,0.6), 0 0 18px rgba(0,245,255,0.35)",
            fontSize: 18,
            letterSpacing: "0.18em",
          }}
        >
          {label}
        </motion.span>

        {/* Press “depth well” feedback */}
        <AnimatePresence>
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0.18), transparent 70%)",
            }}
            animate={{ opacity: press }}
          />
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

// Example usage:
// <HoloDepthButton label="ENTER ARENA" onClick={() => console.log('clicked')} />

export default HoloDepthButton;
