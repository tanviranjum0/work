"use client";
import { motion } from "motion/react";
import { useState } from "react";

const SlidingButton = () => {
  const [accepted, setAccepted] = useState(false);
  const containerWidth = 200;
  const buttonWidth = 50;
  const constraints = containerWidth - buttonWidth - 10; // Padding

  return (
    <div className="bg-red-200 h-screen w-screen flex items-center justify-center">
      <div
        style={{
          width: containerWidth,
          height: 60,
          background: "#ccc",
          borderRadius: 30,
          display: "flex",
          alignItems: "center",
          padding: 5,
          position: "relative",
        }}
      >
        {/* Draggable Button */}
        <motion.div
          style={{
            width: buttonWidth,
            height: 50,
            background: "#fff",
            borderRadius: "50%",
            cursor: "grab",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
          dragMomentum={false}
          drag="x" // Allow horizontal drag only [3]
          dragConstraints={{ left: 0, right: constraints }} // Limit movement [3]
          dragElastic={0.1} // Resistance
          onDragEnd={(event, info) => {
            if (info.point.x > constraints - 10) {
              setAccepted(true);
            } else {
              setAccepted(false);
            }
          }}
        />
        <span
          style={{
            userSelect: "none",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {accepted ? "Accepted" : "Slide Me"}
        </span>
      </div>
    </div>
  );
};

export default SlidingButton;
