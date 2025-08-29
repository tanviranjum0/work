"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const BouncingBallGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [balls, setBalls] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string }>
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const ballIdCounter = useRef(0);

  // Create a new ball
  const createBall = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const size = Math.random() * 30 + 30;
    const x = Math.random() * (containerWidth - size);

    const newBall = {
      id: ballIdCounter.current++,
      x,
      y: -50,
      size,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };

    setBalls((prev) => [...prev, newBall]);
  };

  // Start the game
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setBalls([]);
  };

  // Handle ball click
  const handleBallClick = (id: number) => {
    setScore((prev) => prev + 10);
    setBalls((prev) => prev.filter((ball) => ball.id !== id));
  };

  // Game loop
  useEffect(() => {
    if (!gameActive) return;

    const ballInterval = setInterval(() => {
      if (gameActive) {
        createBall();
      }
    }, 1000);

    return () => clearInterval(ballInterval);
  }, [gameActive]);

  // Game over condition
  useEffect(() => {
    if (balls.length > 15) {
      setGameActive(false);
    }
  }, [balls.length]);

  return (
    <div style={styles.container}>
      <motion.h1
        style={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Bouncing Ball Game
      </motion.h1>

      <div style={styles.gameInfo}>
        <div style={styles.score}>Score: {score}</div>
        <div style={styles.ballsCount}>Balls: {balls.length}/15</div>
      </div>

      {!gameActive ? (
        <motion.div
          style={styles.startContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {score > 0 && (
            <motion.h2
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Game Over! Final Score: {score}
            </motion.h2>
          )}
          <motion.button
            style={styles.startButton}
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {score > 0 ? "Play Again" : "Start Game"}
          </motion.button>
          <p style={styles.instructions}>
            Click on the bouncing balls before they fill up the container!
          </p>
        </motion.div>
      ) : (
        <motion.div
          style={styles.gameContainer}
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {balls.map((ball) => (
            <Ball
              key={ball.id}
              id={ball.id}
              x={ball.x}
              y={ball.y}
              size={ball.size}
              color={ball.color}
              onClick={handleBallClick}
              containerRef={containerRef}
            />
          ))}
        </motion.div>
      )}

      <motion.div
        style={styles.controls}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>How to Play</h3>
        <ul style={styles.instructionsList}>
          <li>Click on balls to earn points</li>
          <li>Don't let more than 15 balls accumulate</li>
          <li>Each ball is worth 10 points</li>
        </ul>
      </motion.div>
    </div>
  );
};

interface BallProps {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  onClick: (id: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const Ball: React.FC<BallProps> = ({
  id,
  x,
  y,
  size,
  color,
  onClick,
  containerRef,
}) => {
  const [position, setPosition] = useState({ x, y });
  const [velocity] = useState({ x: Math.random() * 4 - 2, y: 2 });
  const [gravity] = useState(0.2);
  const [damping] = useState(0.9);
  const animationRef = useRef<number>();

  // Ball animation
  useEffect(() => {
    if (!containerRef.current) return;

    const animate = () => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelocityX = velocity.x;
        let newVelocityY = velocity.y + gravity;

        // Boundary collision
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const containerHeight = containerRef.current?.offsetHeight || 0;

        if (newX <= 0 || newX + size >= containerWidth) {
          newX = newX <= 0 ? 0 : containerWidth - size;
          newVelocityX = -newVelocityX * damping;
        }

        if (newY <= 0 || newY + size >= containerHeight) {
          newY = newY <= 0 ? 0 : containerHeight - size;
          newVelocityY = -newVelocityY * damping;
        }

        velocity.x = newVelocityX;
        velocity.y = newVelocityY;

        return { x: newX, y: newY };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, velocity, gravity, damping, containerRef]);

  return (
    <motion.div
      style={{
        ...styles.ball,
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        backgroundColor: color,
      }}
      onClick={() => onClick(id)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    />
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Arial, sans-serif",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    textAlign: "center",
  },
  gameInfo: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "600px",
    marginBottom: "1rem",
    fontSize: "1.2rem",
    fontWeight: "600",
  },
  score: {
    padding: "0.5rem 1rem",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
  },
  ballsCount: {
    padding: "0.5rem 1rem",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
  },
  startContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  startButton: {
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    backgroundColor: "#FF6B6B",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    margin: "1rem 0",
  },
  instructions: {
    textAlign: "center",
    maxWidth: "400px",
    opacity: 0.8,
  },
  gameContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    height: "400px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    overflow: "hidden",
    margin: "1rem 0",
  },
  ball: {
    position: "absolute",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
  },
  controls: {
    marginTop: "2rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "1.5rem",
    borderRadius: "12px",
    maxWidth: "600px",
    width: "100%",
  },
  instructionsList: {
    textAlign: "left",
    lineHeight: "1.6",
  },
};

export default BouncingBallGame;
