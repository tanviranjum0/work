"use client";
import React, { useState } from "react";
import { useAnimate, motion } from "motion/react";

// Example 1: Basic animation sequence
function AnimatedCard() {
  const [scope, animate] = useAnimate();

  const animateCard = async () => {
    await animate(scope.current, { scale: 1.2 }, { duration: 0.3 });
    await animate(scope.current, { rotate: 90 }, { duration: 0.5 });
    await animate(scope.current, { scale: 1, rotate: 0 }, { duration: 0.3 });
  };

  return (
    <div
      ref={scope}
      onClick={animateCard}
      style={{
        width: 100,
        height: 100,
        background: "blue",
        borderRadius: 8,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      Click me
    </div>
  );
}

// Example 2: Animating multiple elements
function MultiElementAnimation() {
  const [scope, animate] = useAnimate();

  const animateElements = async () => {
    // Animate multiple elements in sequence
    await animate("#box1", { x: 100 }, { duration: 0.5 });
    await animate("#box2", { y: 100 }, { duration: 0.5 });
    await animate("#box3", { rotate: 180 }, { duration: 0.5 });

    // Animate all elements together
    await animate("#box1, #box2, #box3", { scale: 1.5 }, { duration: 0.3 });

    // Return to initial state
    await animate(
      "#box1, #box2, #box3",
      { x: 0, y: 0, rotate: 0, scale: 1 },
      { duration: 0.5 }
    );
  };

  return (
    <div ref={scope}>
      <div
        id="box1"
        style={{
          width: 50,
          height: 50,
          background: "red",
          margin: 10,
        }}
      />
      <div
        id="box2"
        style={{
          width: 50,
          height: 50,
          background: "green",
          margin: 10,
        }}
      />
      <div
        id="box3"
        style={{
          width: 50,
          height: 50,
          background: "blue",
          margin: 10,
        }}
      />
      <button onClick={animateElements}>Animate All</button>
    </div>
  );
}

// Example 3: Scroll-triggered animation
function ScrollAnimation() {
  const [scope, animate] = useAnimate();
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleScroll = () => {
    if (scope.current && !hasAnimated) {
      const rect = scope.current.getBoundingClientRect();
      // When element is in viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        animate(scope.current, { opacity: 1, y: 0 }, { duration: 1 });
        setHasAnimated(true);
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={scope}
      style={{
        opacity: 0,
        transform: "translateY(100px)",
        height: "200px",
        background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
        margin: "50px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "24px",
      }}
    >
      Scroll to see me!
    </div>
  );
}

// Example 4: Interactive animation with gestures
function GestureAnimation() {
  const [scope, animate] = useAnimate();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
    animate(scope.current, { scale: 1.2, background: "#ff6b6b" });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    animate(scope.current, { scale: 1, background: "#4ecdc4" });
  };

  return (
    <motion.div
      ref={scope}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        width: 100,
        height: 100,
        background: "#4ecdc4",
        borderRadius: "50%",
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      Drag me
    </motion.div>
  );
}

// Main component with all examples
function UseAnimateExamples() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Framer Motion useAnimate Examples</h1>

      <h2>1. Basic Animation Sequence</h2>
      <AnimatedCard />

      <h2>2. Multiple Element Animation</h2>
      <MultiElementAnimation />

      <h2>3. Scroll-Triggered Animation</h2>
      <p>Scroll down to see the animation...</p>
      <div style={{ height: "100vh" }}></div>
      <ScrollAnimation />
      <div style={{ height: "100vh" }}></div>

      <h2>4. Gesture-Based Animation</h2>
      <GestureAnimation />
    </div>
  );
}

export default UseAnimateExamples;
