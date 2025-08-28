"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

type IconType = "play" | "pause" | "heart" | "heartFilled" | "moon" | "sun";

const MorphingIconButton: React.FC = () => {
  const [iconType, setIconType] = useState<IconType>("play");

  const togglePlayPause = () => {
    setIconType((prev) => (prev === "play" ? "pause" : "play"));
  };

  const toggleHeart = () => {
    setIconType((prev) => (prev === "heart" ? "heartFilled" : "heart"));
  };

  const toggleTheme = () => {
    setIconType((prev) => (prev === "moon" ? "sun" : "moon"));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Morphing Icon Buttons</h2>
      <div style={styles.buttonGroup}>
        {/* Play/Pause Button */}
        <motion.button
          style={{
            ...styles.button,
            backgroundColor: iconType === "pause" ? "#4CAF50" : "#2196F3",
          }}
          onClick={togglePlayPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            {iconType === "play" ? (
              <motion.polygon
                key="play"
                points="8,5 8,19 19,12"
                fill="white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              <g>
                <motion.rect
                  key="pause-left"
                  x="6"
                  y="4"
                  width="4"
                  height="16"
                  fill="white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.rect
                  key="pause-right"
                  x="14"
                  y="4"
                  width="4"
                  height="16"
                  fill="white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </g>
            )}
          </svg>
        </motion.button>

        {/* Heart/Like Button */}
        <motion.button
          style={{
            ...styles.button,
            backgroundColor: iconType === "heartFilled" ? "#F44336" : "#E91E63",
          }}
          onClick={toggleHeart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            {iconType === "heart" ? (
              <motion.path
                key="heart-outline"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="none"
                stroke="white"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.path
                key="heart-filled"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </svg>
        </motion.button>

        {/* Moon/Sun Button */}
        <motion.button
          style={{
            ...styles.button,
            backgroundColor: iconType === "sun" ? "#FF9800" : "#673AB7",
          }}
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            {iconType === "moon" ? (
              <motion.path
                key="moon"
                d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,3.58,2.92,6.5,6.5,6.5c0.68,0,1.35-0.09,1.99-0.27C16.65,15.91,14.13,17,11.5,17 C7.91,17,5,14.09,5,10.5C5,7.87,6.09,5.35,8.27,4.01C8.85,4.19,9.38,4.43,9.87,4.74C9.59,4.93,9.33,5.16,9.1,5.51z"
                fill="white"
                initial={{ rotate: -30, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <g>
                <motion.circle
                  key="sun-center"
                  cx="12"
                  cy="12"
                  r="5"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.g
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <line
                    x1="12"
                    y1="3"
                    x2="12"
                    y2="1"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="23"
                    x2="12"
                    y2="21"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <line
                    x1="5.64"
                    y1="5.64"
                    x2="4.22"
                    y2="4.22"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <line
                    x1="19.78"
                    y1="19.78"
                    x2="18.36"
                    y2="18.36"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <line
                    x1="3"
                    y1="12"
                    x2="1"
                    y2="12"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <line
                    x1="23"
                    y1="12"
                    x2="21"
                    y2="12"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <line
                    x1="5.64"
                    y1="18.36"
                    x2="4.22"
                    y2="19.78"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <line
                    x1="18.36"
                    y1="5.64"
                    x2="19.78"
                    y2="4.22"
                    stroke="white"
                    strokeWidth="2"
                  />
                </motion.g>
              </g>
            )}
          </svg>
        </motion.button>
      </div>

      <p style={styles.instruction}>
        Click each button to see the morphing animation
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
    color: "white",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "2rem",
    fontSize: "2rem",
    fontWeight: "600",
  },
  buttonGroup: {
    display: "flex",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  button: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
  instruction: {
    fontSize: "1rem",
    opacity: 0.8,
  },
};

export default MorphingIconButton;
