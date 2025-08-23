"use client";
import React, { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

// Example 1: Basic useInView detection
function BasicInView() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <div>
      <div style={{ height: "150vh", padding: "20px" }}>
        <p>Scroll down to see the animation trigger...</p>
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{
          padding: "40px",
          backgroundColor: "#3B82F6",
          color: "white",
          borderRadius: "8px",
          margin: "20px",
        }}
      >
        {isInView ? "I'm in view! 🎉" : "Scroll to see me..."}
      </motion.div>

      <div style={{ height: "150vh" }}></div>
    </div>
  );
}

// Example 2: Combined with useAnimation for more control
function ControlledAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.5 }}
      style={{
        padding: "40px",
        backgroundColor: "#10B981",
        color: "white",
        borderRadius: "8px",
        margin: "20px",
      }}
    >
      Animated with useAnimation
    </motion.div>
  );
}

// Example 3: Trigger animation only once
function OnceAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7 }}
      style={{
        padding: "40px",
        backgroundColor: "#F59E0B",
        color: "white",
        borderRadius: "8px",
        margin: "20px",
      }}
    >
      {isInView ? "I'll only animate once! ✅" : "Haven't seen me yet..."}
    </motion.div>
  );
}

// Example 4: Staggered animations for multiple elements
function StaggeredAnimations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50px" });

  const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

  return (
    <div ref={ref} style={{ margin: "20px" }}>
      {items.map((item, index) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          style={{
            padding: "20px",
            backgroundColor: "#8B5CF6",
            color: "white",
            borderRadius: "8px",
            margin: "10px 0",
          }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}

// Example 5: Percentage-based threshold
function PercentageThreshold() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.8 }); // 30% visible

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotate: -10 }}
      animate={isInView ? { opacity: 1, rotate: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{
        padding: "40px",
        backgroundColor: "#EC4899",
        color: "white",
        borderRadius: "8px",
        margin: "20px",
        textAlign: "center",
      }}
    >
      {isInView ? "30% of me is visible! 🎯" : "Less than 30% visible..."}
    </motion.div>
  );
}

// Example 6: Complex animation sequence
function ComplexAnimationSequence() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
          opacity: { duration: 0.6 },
          scale: { duration: 0.8, delay: 0.2 },
          rotate: { duration: 1, delay: 0.4 },
        },
      });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={controls}
      style={{
        padding: "40px",
        backgroundColor: "#06B6D4",
        color: "white",
        borderRadius: "8px",
        margin: "20px",
        textAlign: "center",
      }}
    >
      Complex animation sequence! ✨
    </motion.div>
  );
}

// Example 7: Image lazy loading with animation
function LazyLoadImage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "100px" });
  const [loaded, setLoaded] = React.useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView && loaded ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7 }}
      style={{ margin: "20px", textAlign: "center" }}
    >
      <img
        src="https://images.unsplash.com/photo-1682687980961-78fa83781450?w=400&h=300&fit=crop"
        alt="Lazy loaded"
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "300px",
          objectFit: "cover",
          borderRadius: "12px",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      <p style={{ marginTop: "10px" }}>
        {isInView && loaded ? "Image loaded and animated! 🖼️" : "Loading..."}
      </p>
    </motion.div>
  );
}

// Example 8: Scroll progress indicator
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0 });
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementProgress =
          1 - rect.bottom / (viewportHeight + rect.height);
        setProgress(Math.max(0, Math.min(1, elementProgress)) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={ref} style={{ margin: "20px", textAlign: "center" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
        style={{
          height: "4px",
          backgroundColor: "#3B82F6",
          marginBottom: "10px",
        }}
      />
      <p>Scroll Progress: {Math.round(progress)}%</p>
      {isInView && <p>I'm in view! 👀</p>}
    </div>
  );
}

// Main component with all examples
function UseInViewExamples() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        Framer Motion useInView Examples
      </h1>

      <BasicInView />

      <div style={{ height: "100vh" }}>
        <p>Keep scrolling... ⬇️</p>
      </div>

      <ControlledAnimation />

      <div style={{ height: "100vh" }}>
        <p>More content to scroll through... 📜</p>
      </div>

      <OnceAnimation />

      <div style={{ height: "100vh" }}>
        <p>Almost there... 🎯</p>
      </div>

      <StaggeredAnimations />

      <div style={{ height: "100vh" }}>
        <p>Keep going! 🚀</p>
      </div>

      <PercentageThreshold />

      <div style={{ height: "100vh" }}>
        <p>Last stretch... 💪</p>
      </div>

      <ComplexAnimationSequence />

      <div style={{ height: "100vh" }}>
        <p>Scroll for images... 🖼️</p>
      </div>

      <LazyLoadImage />

      <div style={{ height: "100vh" }}>
        <p>Progress tracking... 📊</p>
      </div>

      <ScrollProgress />

      <div style={{ height: "100vh" }}>
        <p>You made it to the end! 🎉</p>
      </div>
    </div>
  );
}

export default UseInViewExamples;
