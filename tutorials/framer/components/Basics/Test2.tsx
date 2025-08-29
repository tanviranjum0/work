"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MorphingBlobLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulate loading process
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Blob shape paths for morphing animation
  const blobPaths = [
    "M42.7,-60.3C57.8,-53.3,74.2,-44.1,79.4,-29.8C84.6,-15.5,78.7,3.9,70.5,20.5C62.3,37.1,51.9,51,38.4,60.4C24.9,69.8,8.3,74.7,-6.2,73.2C-20.7,71.7,-33.2,63.8,-44.5,53.3C-55.8,42.8,-66,29.7,-70.2,14.4C-74.5,-0.9,-72.7,-17.4,-65.3,-30.7C-57.9,-44,-45,-54.1,-30.8,-61.5C-16.7,-68.9,-1.2,-73.6,12.1,-71.4C25.4,-69.2,36.5,-60.1,42.7,-60.3Z",
    "M40.4,-58.4C53.4,-51.9,65.4,-42.3,72.5,-28.9C79.6,-15.5,81.8,1.7,77.1,16.3C72.4,30.9,60.8,42.9,47.1,51.8C33.4,60.7,17.7,66.5,1.7,64.3C-14.3,62.1,-28.6,51.9,-40.7,40.3C-52.8,28.7,-62.7,15.7,-65.9,0.6C-69.1,-14.5,-65.6,-31.6,-55.8,-42.2C-46,-52.8,-30,-56.9,-14.5,-61.2C1.1,-65.5,2.2,-70.1,9.2,-70.8C16.2,-71.5,29.1,-68.4,40.4,-58.4Z",
    "M43.2,-62.4C57.1,-56.2,70.2,-47.2,76.7,-33.5C83.2,-19.8,83.1,-1.4,78.3,14.2C73.5,29.8,64,42.6,51.8,52.1C39.6,61.6,24.8,67.8,9.3,69.7C-6.2,71.6,-12.4,69.2,-24.1,62.9C-35.8,56.6,-53,46.4,-62.3,31.7C-71.6,17,-73,,-2.1,-68.2,-19.1C-63.4,-36.1,-52.4,-51.1,-39.3,-57.6C-26.2,-64.1,-13.1,-62.1,0.6,-62.9C14.3,-63.7,28.6,-67.3,43.2,-62.4Z",
    "M40.2,-58.2C53.6,-51.8,66.8,-43.3,73.8,-30.3C80.8,-17.3,81.6,0.2,76.4,15.3C71.2,30.4,60,42.9,46.5,52.3C33,61.6,17.5,67.7,1.5,65.8C-14.5,63.9,-29,54,-41.1,42.3C-53.2,30.6,-62.9,17.3,-66.5,1.7C-70.1,-13.9,-67.6,-31.8,-58.3,-44.4C-49,-57,-32.9,-64.4,-16.8,-67.8C-0.7,-71.2,15.4,-70.6,28.2,-66.1C41,-61.6,50.5,-53.2,58.2,-43.1C65.9,-33,71.7,-21.2,73.8,-8.7C75.9,3.8,74.3,16.9,69.1,28.2C63.9,39.5,55.1,49,44.6,56.3C34.1,63.6,22,68.7,9.1,70.7C-3.8,72.7,-16.5,71.5,-27.1,66.6C-37.7,61.7,-46.2,53,-55.2,43.1C-64.2,33.2,-73.7,22,-77.2,9.1C-80.7,-3.8,-78.2,-17.4,-71.5,-28.8C-64.8,-40.2,-53.9,-49.5,-41.7,-56.4C-29.5,-63.3,-16,-67.9,-0.3,-67.5C15.4,-67.1,30.8,-61.7,40.2,-58.2Z",
    "M40.9,-59.1C54.8,-52.8,69,-44.8,76.1,-32.2C83.2,-19.6,83.2,-2.4,78.7,12.6C74.2,27.6,65.3,40.4,53.4,50.2C41.5,60,26.6,66.8,11.2,68.5C-4.2,70.2,-19.1,66.8,-31.4,59.4C-43.7,52,-53.4,40.6,-60.1,26.9C-66.8,13.2,-70.5,-2.8,-67.9,-17.5C-65.3,-32.2,-56.4,-45.6,-44.1,-52.6C-31.8,-59.6,-15.9,-60.2,-0.3,-59.8C15.3,-59.4,30.6,-58,40.9,-59.1Z",
  ];

  // Color variants for the blob
  const blobColors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#9b59b6", "#3498db"];

  return (
    <div style={styles.container}>
      <div style={styles.loaderContainer}>
        <motion.svg
          viewBox="0 0 200 200"
          style={styles.blob}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.path
            fill={blobColors[0]}
            animate={{
              d: blobPaths,
              fill: blobColors,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          />
        </motion.svg>

        <motion.div
          style={styles.progressText}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {progress}%
        </motion.div>
      </div>

      <motion.div
        style={styles.controls}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 style={styles.title}>Morphing Blob Loader</h2>
        <p style={styles.description}>
          Watch the organic shape continuously morph while loading
        </p>

        <div style={styles.progressBarContainer}>
          <motion.div
            style={styles.progressBar}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", damping: 15 }}
          />
        </div>

        <div style={styles.buttonGroup}>
          <motion.button
            style={styles.button}
            onClick={() => setIsLoading(true)}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Loading
          </motion.button>

          <motion.button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => {
              setIsLoading(false);
              setProgress(0);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        </div>
      </motion.div>

      {/* Floating particles for background effect */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            ...styles.particle,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: blobColors[i % blobColors.length],
          }}
          animate={{
            y: [0, Math.random() * 40 - 20, 0],
            x: [0, Math.random() * 40 - 20, 0],
            scale: [0, 1, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
    color: "white",
  },
  loaderContainer: {
    position: "relative",
    width: "200px",
    height: "200px",
    marginBottom: "2rem",
  },
  blob: {
    width: "100%",
    height: "100%",
    filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))",
  },
  progressText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "white",
    textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
  },
  controls: {
    textAlign: "center",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "2rem",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    maxWidth: "400px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1rem",
    background: "linear-gradient(90deg, #fff, #a892fe, #fff)",
    backgroundSize: "200% auto",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "shine 4s linear infinite",
  },
  description: {
    fontSize: "1rem",
    marginBottom: "1.5rem",
    opacity: 0.9,
  },
  progressBarContainer: {
    width: "100%",
    height: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "5px",
    overflow: "hidden",
    marginBottom: "1.5rem",
  },
  progressBar: {
    height: "100%",
    background:
      "linear-gradient(90deg, #FF6B6B, #4ECDC4, #FFE66D, #9b59b6, #3498db)",
    backgroundSize: "200% 100%",
    borderRadius: "5px",
    animation: "gradientShift 3s linear infinite",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  particle: {
    position: "absolute",
    borderRadius: "50%",
    opacity: 0,
    zIndex: 0,
  },
};

// Add keyframes for animations
const keyframes = `
  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
  
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

// Add styles to document
document.head.insertAdjacentHTML("beforeend", `<style>${keyframes}</style>`);

export default MorphingBlobLoader;
