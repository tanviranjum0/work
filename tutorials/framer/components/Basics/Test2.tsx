"use client";
import { useRef, useEffect, useCallback } from "react";
import { useAnimate } from "framer-motion";

// Custom hook that mimics a useAnimationFrame functionality
const useAnimationFrame = (callback) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = useCallback(
    (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);
};

// Example 1: Basic useAnimationFrame implementation
function BasicAnimationFrame() {
  const [scope, animate] = useAnimate();
  const position = useRef(0);

  useAnimationFrame((deltaTime) => {
    position.current += deltaTime * 0.1;
    animate(scope.current, { x: position.current % 400 }, { duration: 0 });
  });

  return (
    <div>
      <div
        ref={scope}
        style={{
          width: 50,
          height: 50,
          backgroundColor: "blue",
          borderRadius: 8,
        }}
      />
      <p>Continuously animating with requestAnimationFrame</p>
    </div>
  );
}

// Example 2: Interactive animation with controls
function ControlledAnimation() {
  const [scope, animate] = useAnimate();
  const position = useRef(0);
  const isPlaying = useRef(true);

  useAnimationFrame((deltaTime) => {
    if (!isPlaying.current) return;

    position.current += deltaTime * 0.1;
    animate(scope.current, { x: position.current % 400 }, { duration: 0 });
  });

  return (
    <div>
      <div
        ref={scope}
        style={{
          width: 50,
          height: 50,
          backgroundColor: "green",
          borderRadius: 8,
        }}
      />
      <button onClick={() => (isPlaying.current = true)}>Play</button>
      <button onClick={() => (isPlaying.current = false)}>Pause</button>
      <button
        onClick={() => {
          position.current = 0;
          animate(scope.current, { x: 0 }, { duration: 0.3 });
        }}
      >
        Reset
      </button>
    </div>
  );
}

// Example 3: Physics-based animation
function PhysicsAnimation() {
  const [scope, animate] = useAnimate();
  const position = useRef(0);
  const velocity = useRef(2);
  const gravity = 0.2;
  const damping = 0.9;

  useAnimationFrame((deltaTime) => {
    // Scale deltaTime to make animation consistent across different refresh rates
    const scaledDelta = deltaTime / 16;

    velocity.current += gravity * scaledDelta;
    position.current += velocity.current * scaledDelta;

    // Bounce when hitting bottom
    if (position.current > 300) {
      position.current = 300;
      velocity.current = -velocity.current * damping;
    }

    animate(scope.current, { y: position.current }, { duration: 0 });
  });

  return (
    <div
      style={{ height: 400, position: "relative", border: "1px solid #ccc" }}
    >
      <div
        ref={scope}
        style={{
          width: 50,
          height: 50,
          backgroundColor: "red",
          borderRadius: "50%",
          position: "absolute",
        }}
      />
      <p>Physics-based bouncing ball with gravity</p>
    </div>
  );
}

// Example 4: Smooth mouse follower with easing
function SmoothMouseFollower() {
  const [scope, animate] = useAnimate();
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX - 25, y: e.clientY - 25 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useAnimationFrame((deltaTime) => {
    const easing = 0.1 * (deltaTime / 16); // Scale easing with deltaTime

    currentPos.current.x +=
      (targetPos.current.x - currentPos.current.x) * easing;
    currentPos.current.y +=
      (targetPos.current.y - currentPos.current.y) * easing;

    animate(
      scope.current,
      { x: currentPos.current.x, y: currentPos.current.y },
      { duration: 0 }
    );
  });

  return (
    <div
      ref={scope}
      style={{
        width: 50,
        height: 50,
        backgroundColor: "purple",
        borderRadius: "50%",
        position: "fixed",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    />
  );
}

// Example 5: Complex animation with multiple elements
function ParticleWave() {
  const [scope, animate] = useAnimate();
  const particles = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: i * 30,
      y: 150,
      phase: i * 0.2,
    }))
  );

  useAnimationFrame((deltaTime) => {
    const time = performance.now() * 0.001;

    particles.current.forEach((particle) => {
      particle.y = 150 + Math.sin(time + particle.phase) * 50;
    });

    particles.current.forEach((particle) => {
      const element = document.getElementById(`particle-${particle.id}`);
      if (element) {
        animate(element, { y: particle.y }, { duration: 0 });
      }
    });
  });

  return (
    <div ref={scope} style={{ position: "relative", height: 300 }}>
      {particles.current.map((particle) => (
        <div
          key={particle.id}
          id={`particle-${particle.id}`}
          style={{
            width: 20,
            height: 20,
            backgroundColor: `hsl(${particle.id * 24}, 70%, 60%)`,
            borderRadius: "50%",
            position: "absolute",
            left: particle.x,
            y: particle.y,
          }}
        />
      ))}
    </div>
  );
}

// Main component with all examples
function AnimationFrameExamples() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Custom useAnimationFrame Examples</h1>

      <h2>1. Basic Continuous Animation</h2>
      <BasicAnimationFrame />

      <h2>2. Controlled Animation</h2>
      <ControlledAnimation />

      <h2>3. Physics-based Animation</h2>
      <PhysicsAnimation />

      <h2>4. Smooth Mouse Follower</h2>
      <SmoothMouseFollower />

      <h2>5. Particle Wave</h2>
      <ParticleWave />
    </div>
  );
}

export default AnimationFrameExamples;
