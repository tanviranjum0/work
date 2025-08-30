"use client";
"Button 2";
import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const MagneticButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth movement
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transform the spring values for the magnetic effect
  const translateX = useTransform(springX, [-1, 0, 1], [-10, 0, 10]);
  const translateY = useTransform(springY, [-1, 0, 1], [-10, 0, 10]);

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    console.log(rect);
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // console.log(centerX, centerY);
    // Calculate distance from center (normalized to -1 to 1 range)
    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);
    // console.log(distanceX, distanceY);
    // Update motion values
    mouseX.set(distanceX);
    mouseY.set(distanceY);
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div style={styles.container}>
      <motion.div
        ref={buttonRef}
        style={{
          ...styles.button,
          x: translateX,
          y: translateY,
          scale: isHovered ? 1.05 : 1,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <span style={styles.text}>Hover Me</span>
        <div style={styles.tooltip}>Magnetic effect active!</div>
      </motion.div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  button: {
    position: "relative",
    padding: "16px 32px",
    backgroundColor: "#fff",
    color: "#764ba2",
    borderRadius: "50px",
    fontWeight: "600",
    fontSize: "18px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
  },
  text: {
    zIndex: 2,
  },
  tooltip: {
    position: "absolute",
    bottom: "-40px",
    fontSize: "12px",
    color: "white",
    opacity: 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none",
  },
};

export default MagneticButton;
