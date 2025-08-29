"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  size: number;
  opacity: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  blur: number;
}

const GalaxyBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random stars
  useEffect(() => {
    if (!containerRef.current) return;

    const generateStars = (count: number): Star[] => {
      const newStars: Star[] = [];
      for (let i = 0; i < count; i++) {
        newStars.push({
          id: i,
          size: Math.random() * 4 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 40 + 20,
          delay: Math.random() * 5,
          blur: Math.random() * 3,
        });
      }
      return newStars;
    };

    setStars(generateStars(150));
  }, []);

  return (
    <div style={styles.container} ref={containerRef}>
      {/* Animated background gradient */}
      <motion.div
        style={styles.galaxyBackground}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Large distant stars */}
      {stars.slice(0, 50).map((star) => (
        <motion.div
          key={`distant-${star.id}`}
          style={{
            ...styles.star,
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity * 0.7,
            filter: `blur(${star.blur}px)`,
          }}
          animate={{
            opacity: [
              star.opacity * 0.7,
              star.opacity * 0.9,
              star.opacity * 0.7,
            ],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Medium stars */}
      {stars.slice(50, 120).map((star) => (
        <motion.div
          key={`medium-${star.id}`}
          style={{
            ...styles.star,
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            filter: `blur(${star.blur}px)`,
          }}
          animate={{
            x: [0, Math.random() * 20 - 10, 0],
            y: [0, Math.random() * 20 - 10, 0],
            opacity: [star.opacity, star.opacity * 1.2, star.opacity],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Large twinkling stars */}
      {stars.slice(120, 150).map((star) => (
        <motion.div
          key={`large-${star.id}`}
          style={{
            ...styles.star,
            width: star.size * 1.5,
            height: star.size * 1.5,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            filter: `blur(${star.blur}px)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [star.opacity, star.opacity * 1.5, star.opacity],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: star.duration / 2,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shooting stars */}
      <motion.div
        style={styles.shootingStar}
        animate={{
          x: [0, window.innerWidth],
          y: [0, window.innerHeight],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: Math.random() * 10 + 5,
        }}
      />

      <motion.div
        style={{ ...styles.shootingStar, top: "20%", left: "10%" }}
        animate={{
          x: [0, window.innerWidth],
          y: [0, window.innerHeight / 2],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: Math.random() * 15 + 8,
        }}
      />

      {/* Content */}
      <motion.div
        style={styles.content}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <h1 style={styles.title}>Galaxy of Stars</h1>
        <p style={styles.subtitle}>
          A cosmic background with floating, twinkling stars
        </p>
        <motion.button
          style={styles.button}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Explore the Universe
        </motion.button>
      </motion.div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  galaxyBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(135deg, #0b0b2a 0%, #1a1a40 30%, #2d1b4e 70%, #3d1b69 100%)",
    zIndex: -1,
  },
  star: {
    position: "absolute",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    boxShadow:
      "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)",
    zIndex: 1,
  },
  shootingStar: {
    position: "absolute",
    top: "10%",
    left: "5%",
    width: "100px",
    height: "2px",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
    transform: "rotate(-45deg)",
    zIndex: 2,
  },
  content: {
    textAlign: "center",
    color: "white",
    zIndex: 10,
    padding: "2rem",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    maxWidth: "600px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "1rem",
    background: "linear-gradient(90deg, #fff, #a892fe, #fff)",
    backgroundSize: "200% auto",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "shine 4s linear infinite",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    opacity: 0.9,
  },
  button: {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#0b0b2a",
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
    transition: "all 0.3s ease",
  },
};

// Add keyframes for text shine animation
const keyframes = `
  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
`;

// Add styles to document
if (typeof document === "undefined") {
  // during server evaluation
}
document.head.insertAdjacentHTML("beforeend", `<style>${keyframes}</style>`);

export default GalaxyBackground;
