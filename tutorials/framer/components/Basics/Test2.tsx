"use client";
import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// Example 1: Dynamic gradient background
function AnimatedGradientBox() {
  const angle = useMotionValue(0);
  const progress = useMotionValue(0);

  const gradient = useMotionTemplate`
    linear-gradient(
      ${angle}deg,
      hsl(${progress}, 70%, 60%),
      hsl(${progress.get() + 120}, 70%, 60%)
    )
  `;

  React.useEffect(() => {
    angle.set(360, { duration: 4, repeat: Infinity, ease: "linear" });
    progress.set(360, { duration: 8, repeat: Infinity, ease: "linear" });
  }, [angle, progress]);

  return (
    <motion.div
      style={{
        background: gradient,
        width: 200,
        height: 200,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
      }}
    >
      Animated Gradient
    </motion.div>
  );
}

// Example 2: Dynamic box shadow
function ShadowAnimation() {
  const shadowSize = useMotionValue(10);
  const shadowBlur = useMotionValue(20);

  const boxShadow = useMotionTemplate`
    ${shadowSize}px ${shadowSize}px ${shadowBlur}px 
    rgba(0, 0, 0, 0.3)
  `;

  React.useEffect(() => {
    shadowSize.set(20, {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
    });
    shadowBlur.set(40, {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
    });
  }, [shadowSize, shadowBlur]);

  return (
    <motion.div
      style={{
        width: 150,
        height: 150,
        backgroundColor: "#3B82F6",
        borderRadius: 8,
        boxShadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      Pulsing Shadow
    </motion.div>
  );
}

// Example 3: Complex transform with multiple values
function AdvancedTransform() {
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);
  const translateX = useMotionValue(0);

  const transform = useMotionTemplate`
    rotate(${rotate}deg) 
    scale(${scale}) 
    translateX(${translateX}px)
  `;

  React.useEffect(() => {
    rotate.set(360, { duration: 2, repeat: Infinity, ease: "linear" });
    scale.set(1.2, { duration: 1, repeat: Infinity, repeatType: "reverse" });
    translateX.set(50, {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
    });
  }, [rotate, scale, translateX]);

  return (
    <motion.div
      style={{
        width: 100,
        height: 100,
        backgroundColor: "#10B981",
        borderRadius: 8,
        transform,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: 12,
        textAlign: "center",
      }}
    >
      Complex Transform
    </motion.div>
  );
}

// Example 4: Dynamic border and background
function BorderBackgroundAnimation() {
  const borderWidth = useMotionValue(2);
  const borderRadius = useMotionValue(8);
  const hue = useMotionValue(0);

  const border = useMotionTemplate`
    ${borderWidth}px solid hsl(${hue}, 70%, 50%)
  `;

  const background = useMotionTemplate`
    linear-gradient(
      45deg,
      hsl(${hue}, 70%, 90%),
      hsl(${hue.get() + 60}, 70%, 90%)
    )
  `;

  React.useEffect(() => {
    borderWidth.set(8, {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse",
    });
    borderRadius.set(20, {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
    });
    hue.set(360, { duration: 3, repeat: Infinity, ease: "linear" });
  }, [borderWidth, borderRadius, hue]);

  return (
    <motion.div
      style={{
        width: 150,
        height: 150,
        border,
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <span
        style={{ color: `hsl(${hue.get()}, 70%, 30%)`, fontWeight: "bold" }}
      >
        Dynamic Styles
      </span>
    </motion.div>
  );
}

// Example 5: Text shadow animation
function TextShadowEffect() {
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const blur = useMotionValue(0);
  const hue = useMotionValue(0);

  const textShadow = useMotionTemplate`
    ${offsetX}px ${offsetY}px ${blur}px 
    hsl(${hue}, 70%, 50%)
  `;

  React.useEffect(() => {
    offsetX.set(5, { duration: 2, repeat: Infinity, repeatType: "reverse" });
    offsetY.set(5, { duration: 2, repeat: Infinity, repeatType: "reverse" });
    blur.set(15, { duration: 3, repeat: Infinity, repeatType: "reverse" });
    hue.set(360, { duration: 4, repeat: Infinity, ease: "linear" });
  }, [offsetX, offsetY, blur, hue]);

  return (
    <motion.h2
      style={{
        textShadow,
        color: "white",
        padding: 20,
        backgroundColor: "#1F2937",
        borderRadius: 8,
        margin: 0,
      }}
    >
      Animated Text Shadow
    </motion.h2>
  );
}

// Example 6: Clip-path animation
function ClipPathAnimation() {
  const clipSize = useMotionValue(50);

  const clipPath = useMotionTemplate`
    polygon(
      ${clipSize}% 0%, 
      100% ${clipSize}%, 
      ${100 - clipSize.get()}% 100%, 
      0% ${100 - clipSize.get()}%
    )
  `;

  React.useEffect(() => {
    clipSize.set(0, { duration: 2, repeat: Infinity, repeatType: "reverse" });
  }, [clipSize]);

  return (
    <motion.div
      style={{
        width: 200,
        height: 200,
        backgroundColor: "#8B5CF6",
        clipPath,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
      }}
    >
      Dynamic Clip
    </motion.div>
  );
}

// Example 7: Multiple gradients with masks
function ComplexGradientBackground() {
  const progress1 = useMotionValue(0);
  const progress2 = useMotionValue(120);
  const progress3 = useMotionValue(240);
  const angle = useMotionValue(0);

  const background = useMotionTemplate`
    linear-gradient(${angle}deg, 
      hsl(${progress1}, 70%, 60%) 0%,
      hsl(${progress2}, 70%, 60%) 50%,
      hsl(${progress3}, 70%, 60%) 100%
    ),
    radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 70%
    )
  `;

  React.useEffect(() => {
    progress1.set(360, { duration: 6, repeat: Infinity, ease: "linear" });
    progress2.set(480, { duration: 6, repeat: Infinity, ease: "linear" });
    progress3.set(600, { duration: 6, repeat: Infinity, ease: "linear" });
    angle.set(360, { duration: 8, repeat: Infinity, ease: "linear" });
  }, [progress1, progress2, progress3, angle]);

  return (
    <motion.div
      style={{
        width: 250,
        height: 250,
        background,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
      }}
    >
      Multi-Gradient
    </motion.div>
  );
}

// Example 8: Interactive color picker
function InteractiveColorPicker() {
  const hue = useMotionValue(180);
  const saturation = useMotionValue(70);
  const lightness = useMotionValue(50);

  const color = useMotionTemplate`hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return (
    <div style={{ padding: 20, backgroundColor: "#F3F4F6", borderRadius: 12 }}>
      <motion.div
        style={{
          width: 200,
          height: 200,
          backgroundColor: color,
          borderRadius: 8,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: lightness.get() > 50 ? "black" : "white",
          fontWeight: "bold",
        }}
      >
        HSL({hue.get()}, {saturation.get()}%, {lightness.get()}%)
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <label>Hue: {hue.get()}</label>
          <input
            type="range"
            min="0"
            max="360"
            value={hue.get()}
            onChange={(e) => hue.set(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Saturation: {saturation.get()}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={saturation.get()}
            onChange={(e) => saturation.set(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Lightness: {lightness.get()}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={lightness.get()}
            onChange={(e) => lightness.set(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

// Main component with all examples
function UseMotionTemplateExamples() {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{ textAlign: "center", marginBottom: "40px", color: "#1F2937" }}
      >
        Framer Motion useMotionTemplate Examples
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <ExampleCard title="1. Animated Gradient">
          <AnimatedGradientBox />
        </ExampleCard>

        <ExampleCard title="2. Shadow Animation">
          <ShadowAnimation />
        </ExampleCard>

        <ExampleCard title="3. Complex Transform">
          <AdvancedTransform />
        </ExampleCard>

        <ExampleCard title="4. Border & Background">
          <BorderBackgroundAnimation />
        </ExampleCard>

        <ExampleCard title="5. Text Shadow Effect">
          <TextShadowEffect />
        </ExampleCard>

        <ExampleCard title="6. Clip Path Animation">
          <ClipPathAnimation />
        </ExampleCard>

        <ExampleCard title="7. Multi-Gradient Background">
          <ComplexGradientBackground />
        </ExampleCard>

        <ExampleCard title="8. Interactive Color Picker">
          <InteractiveColorPicker />
        </ExampleCard>
      </div>
    </div>
  );
}

// Helper component for example cards
function ExampleCard({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <h3 style={{ margin: 0, color: "#374151", textAlign: "center" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default UseMotionTemplateExamples;
