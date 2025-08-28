"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const TiltButton: React.FC = () => {
  const buttonRef = useRef<HTMLDivElement>(null);

  // Motion values for tracking cursor position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth movement
  const springConfig = { damping: 15, stiffness: 300 };
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [10, -10]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-10, 10]),
    springConfig
  );

  // Additional transforms for depth effect
  const scale = useSpring(
    useTransform(x, [-0.5, 0.5, 0], [1, 1, 1.05]),
    springConfig
  );
  const translateZ = useSpring(
    useTransform(x, [-0.5, 0.5], [-10, 10]),
    springConfig
  );

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate position as a percentage of the element's size
    const xPos = mouseX / width - 0.5;
    const yPos = mouseY / height - 0.5;

    // Update motion values
    x.set(xPos);
    y.set(yPos);
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={styles.container}>
      <motion.div
        ref={buttonRef}
        style={{
          ...styles.button,
          rotateX,
          rotateY,
          scale,
          transformPerspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, rotateX: 0, rotateY: 0 }}
      >
        <motion.span style={styles.text}>Hover Me</motion.span>
        <motion.div
          style={{
            ...styles.highlight,
            opacity: useTransform(x, [-0.5, 0, 0.5], [0.3, 0.5, 0.3]),
            left: useTransform(x, [-0.5, 0.5], ["10%", "90%"]),
          }}
        />
      </motion.div>

      <p style={styles.instruction}>
        Move your cursor over the button to see the 3D tilt effect
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
    height: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    position: "relative",
    padding: "18px 36px",
    backgroundColor: "#fff",
    color: "#764ba2",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    transformStyle: "preserve-3d",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    position: "relative",
    zIndex: 2,
  },
  highlight: {
    position: "absolute",
    top: "0",
    width: "60%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
    transition: "opacity 0.3s",
    transform: "translateZ(20px)",
  },
  instruction: {
    marginTop: "2rem",
    color: "white",
    fontSize: "1rem",
    opacity: 0.8,
  },
};

export default TiltButton;
