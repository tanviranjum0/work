"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Layer {
  id: string;
  depth: number;
  content: string;
  color: string;
}

const ParallaxCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transform values for different layers based on depth
  const createTransform = (depth: number, range: number) => {
    return useTransform(springX, [-0.5, 0.5], [-range * depth, range * depth]);
  };

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
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
  };

  // Card layers with different depths
  const layers: Layer[] = [
    { id: "layer1", depth: 0.2, content: "Background", color: "#FF6B6B" },
    { id: "layer2", depth: 0.4, content: "Mountains", color: "#4ECDC4" },
    { id: "layer3", depth: 0.6, content: "Trees", color: "#FFE66D" },
    { id: "layer4", depth: 0.8, content: "Foreground", color: "#9b59b6" },
    { id: "layer5", depth: 1.0, content: "Main Content", color: "#3498db" },
  ];

  return (
    <div style={styles.container}>
      <motion.div
        ref={cardRef}
        style={styles.cardContainer}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Background layers with parallax effect */}
        {layers.map((layer, index) => (
          <CardLayer
            key={layer.id}
            layer={layer}
            mouseX={mouseX}
            mouseY={mouseY}
            zIndex={index}
            isContentLayer={index === layers.length - 1}
          />
        ))}

        {/* Instructions overlay */}
        <motion.div
          style={styles.instruction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Move your cursor to see the 3D parallax effect
        </motion.div>
      </motion.div>
    </div>
  );
};

interface CardLayerProps {
  layer: Layer;
  mouseX: any;
  mouseY: any;
  zIndex: number;
  isContentLayer: boolean;
}

const CardLayer: React.FC<CardLayerProps> = ({
  layer,
  mouseX,
  mouseY,
  zIndex,
  isContentLayer,
}) => {
  // Spring physics for smooth movement
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transform values based on depth
  const translateX = useTransform(
    springX,
    [-0.5, 0.5],
    [-20 * layer.depth, 20 * layer.depth]
  );
  const translateY = useTransform(
    springY,
    [-0.5, 0.5],
    [-20 * layer.depth, 20 * layer.depth]
  );

  // Scale effect for depth
  const scale = useTransform(
    springY,
    [-0.5, 0.5],
    [1 - 0.05 * layer.depth, 1 + 0.05 * layer.depth]
  );

  // Rotation effects for 3D perspective
  const rotateX = useTransform(
    springY,
    [-0.5, 0.5],
    [5 * layer.depth, -5 * layer.depth]
  );
  const rotateY = useTransform(
    springX,
    [-0.5, 0.5],
    [-5 * layer.depth, 5 * layer.depth]
  );

  return (
    <motion.div
      style={{
        ...styles.layer,
        zIndex: zIndex,
        backgroundColor: layer.color,
        translateX,
        translateY,
        scale,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        filter: isContentLayer ? "none" : `blur(${1 - layer.depth}px)`,
        opacity: isContentLayer ? 1 : 0.8 - zIndex * 0.1,
      }}
    >
      {isContentLayer ? (
        <div style={styles.content}>
          <h2 style={styles.title}>3D Parallax Card</h2>
          <p style={styles.description}>
            Move your cursor around to see the depth effect
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>Layered Depth</div>
            <div style={styles.feature}>Smooth Animation</div>
            <div style={styles.feature}>3D Perspective</div>
          </div>
        </div>
      ) : (
        <div style={styles.layerContent}>{layer.content}</div>
      )}
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    fontFamily: "Arial, sans-serif",
    padding: "2rem",
    perspective: "1000px",
  },
  cardContainer: {
    position: "relative",
    width: "400px",
    height: "500px",
    cursor: "pointer",
  },
  layer: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  },
  layerContent: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    padding: "2rem",
    textAlign: "center",
    color: "white",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1rem",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
  },
  description: {
    fontSize: "1rem",
    marginBottom: "2rem",
    opacity: 0.9,
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  feature: {
    padding: "0.8rem 1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  instruction: {
    position: "absolute",
    bottom: "20px",
    left: "0",
    right: "0",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.9rem",
    zIndex: 100,
  },
};

export default ParallaxCard;
