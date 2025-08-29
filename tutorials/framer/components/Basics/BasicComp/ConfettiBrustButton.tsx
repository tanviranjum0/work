"use client";
import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ConfettiParticle {
  id: number;
  color: string;
  size: number;
  shape: "circle" | "rectangle" | "star";
  rotation: number;
}

const ConfettiBurst: React.FC = () => {
  const [isExploding, setIsExploding] = useState(false);
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  // Colors for the confetti particles
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFE66D",
    "#9b59b6",
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#f39c12",
    "#1abc9c",
    "#e67e22",
  ];

  // Shapes for the confetti particles
  const shapes: ("circle" | "rectangle" | "star")[] = [
    "circle",
    "rectangle",
    "star",
  ];

  // Create confetti particles
  const createConfetti = () => {
    const newParticles: ConfettiParticle[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 4,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
      });
    }

    setParticles(newParticles);
    setIsExploding(true);

    // Reset after animation completes
    setTimeout(() => {
      setIsExploding(false);
      setTimeout(() => setParticles([]), 500);
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <motion.button
        style={styles.button}
        onClick={createConfetti}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isExploding}
      >
        {isExploding ? "Celebrating!" : "Click for Confetti!"}
      </motion.button>

      <div style={styles.confettiContainer}>
        {particles.map((particle) => (
          <ConfettiParticle key={particle.id} particle={particle} />
        ))}
      </div>

      <p style={styles.instruction}>
        Click the button to trigger a confetti explosion!
      </p>
    </div>
  );
};

interface ConfettiParticleProps {
  particle: ConfettiParticle;
}

const ConfettiParticle: React.FC<ConfettiParticleProps> = ({ particle }) => {
  // Random values for animation
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 200 + 100;
  const duration = Math.random() * 1 + 0.5;
  const delay = Math.random() * 0.5;

  // Calculate final position
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  // Rotation animation
  const rotate = useMotionValue(0);
  const rotateSpring = useSpring(rotate, { damping: 20, stiffness: 100 });
  const rotateTransform = useTransform(
    rotateSpring,
    (value) => `rotate(${value}deg)`
  );

  // Start rotation animation
  React.useEffect(() => {
    rotate.set(particle.rotation + 360 * (Math.random() > 0.5 ? 1 : -1));
  }, [particle.rotation, rotate]);

  return (
    <motion.div
      style={{
        ...styles.particle,
        backgroundColor: particle.color,
        width: particle.size,
        height: particle.size,
        borderRadius:
          particle.shape === "circle"
            ? "50%"
            : particle.shape === "star"
            ? "50% 50% 0 0"
            : "2px",
        rotate: rotateTransform,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x,
        y,
        opacity: [1, 1, 0],
        scale: [0, 1, 0.5],
      }}
      transition={{
        x: { duration, ease: "easeOut" },
        y: {
          duration,
          ease: [0.17, 0.67, 0.83, 0.67],
          delay,
        },
        opacity: { duration, times: [0, 0.8, 1], delay },
        scale: { duration, times: [0, 0.2, 1], delay },
      }}
    >
      {particle.shape === "star" && <div style={styles.starInner} />}
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Arial, sans-serif",
    padding: "2rem",
    overflow: "hidden",
    position: "relative",
  },
  button: {
    padding: "1.2rem 2.5rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
    zIndex: 10,
    position: "relative",
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
  },
  particle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  starInner: {
    width: "60%",
    height: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: "50%",
    clipPath:
      "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  },
  instruction: {
    marginTop: "2rem",
    color: "white",
    fontSize: "1rem",
    textAlign: "center",
    maxWidth: "300px",
    opacity: 0.8,
  },
};

export default ConfettiBurst;
