"use client";
import React, { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const ShimmeringGemstoneButton: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth movement
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transform values for various effects
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const scale = useTransform(springX, [-0.5, 0.5, 0], [1, 1, 1.05]);
  const glowSize = useTransform(springX, [-0.5, 0.5], [40, 60]);
  const gemShine = useTransform(springX, [-0.5, 0, 0.5], [0.3, 0.7, 0.3]);

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    // Calculate position as a percentage of the element's size
    const xPos = mouseXPos / width - 0.5;
    const yPos = mouseYPos / height - 0.5;

    // Update motion values
    mouseX.set(xPos);
    mouseY.set(yPos);
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Create gradient background with motion template
  const background = useMotionTemplate`
    radial-gradient(
      ${glowSize}px circle at ${useMotionTemplate`${springX}% ${springY}%`},
      rgba(255, 255, 255, ${gemShine}) 0%,
      rgba(255, 255, 255, 0.1) 40%,
      transparent 80%
    ),
    linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  `;

  // Create border gradient with motion template
  const borderGradient = useMotionTemplate`
    linear-gradient(
      ${useTransform(springX, [-0.5, 0.5], [135, 225])}deg,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.8) 100%
    )
  `;

  return (
    <div style={styles.container}>
      <motion.button
        ref={buttonRef}
        style={{
          ...styles.button,
          background,
          borderImage: borderGradient,
          rotateX,
          rotateY,
          scale,
          transformPerspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.span
          style={styles.text}
          animate={{
            textShadow: isHovered
              ? "0 0 10px rgba(255, 255, 255, 0.8)"
              : "0 0 5px rgba(255, 255, 255, 0.5)",
          }}
          transition={{ duration: 0.3 }}
        >
          Shimmering Gem
        </motion.span>

        {/* Inner shine effect */}
        <motion.div
          style={{
            ...styles.innerShine,
            opacity: useTransform(springX, [-0.5, 0.5], [0.3, 0.7]),
            left: useTransform(springX, [-0.5, 0.5], ["10%", "90%"]),
          }}
        />

        {/* Gem facets */}
        <motion.div
          style={{
            ...styles.facet,
            top: "20%",
            left: "20%",
            width: "20px",
            height: "20px",
            opacity: useTransform(springX, [-0.5, 0.5], [0.4, 0.8]),
          }}
          animate={{
            rotate: isHovered ? 45 : 0,
          }}
          transition={{ duration: 0.5 }}
        />

        <motion.div
          style={{
            ...styles.facet,
            top: "60%",
            left: "70%",
            width: "15px",
            height: "15px",
            opacity: useTransform(springY, [-0.5, 0.5], [0.3, 0.7]),
          }}
          animate={{
            rotate: isHovered ? -45 : 0,
          }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />

        {/* Press effect */}
        {isPressed && (
          <motion.div
            style={styles.pressEffect}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.button>

      <p style={styles.instruction}>
        Hover and move your cursor over the gem to see the shimmering effect
      </p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    fontFamily: "Arial, sans-serif",
    padding: "2rem",
  },
  button: {
    position: "relative",
    padding: "1.5rem 3rem",
    border: "2px solid transparent",
    borderRadius: "12px",
    fontSize: "1.5rem",
    fontWeight: "600",
    cursor: "pointer",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    transformStyle: "preserve-3d",
    borderImageSlice: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    position: "relative",
    zIndex: 2,
    color: "white",
    letterSpacing: "1px",
  },
  innerShine: {
    position: "absolute",
    top: "0",
    width: "30%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
    transition: "opacity 0.3s",
    transform: "skewX(-20deg)",
  },
  facet: {
    position: "absolute",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))",
    borderRadius: "4px",
    zIndex: 1,
  },
  pressEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
    borderRadius: "12px",
  },
  instruction: {
    marginTop: "2rem",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    maxWidth: "400px",
  },
};

export default ShimmeringGemstoneButton;
