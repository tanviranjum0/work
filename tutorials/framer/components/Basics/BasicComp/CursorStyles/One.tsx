"use client";
import { object } from "motion/react-client";
import "./one.css";
import { useEffect } from "react";

const One = () => {
  useEffect(() => {
    const cursor = document.querySelector(".cursor") as HTMLElement;
    const body = document.querySelector("body") as HTMLElement;
    const toggleBtn = document.getElementById(
      "toggle-effect"
    ) as HTMLButtonElement;
    const colorBtn = document.getElementById(
      "change-color"
    ) as HTMLButtonElement;
    const clearBtn = document.getElementById(
      "clear-trails"
    ) as HTMLButtonElement;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let trails: object[] = [];
    let effectEnabled = true;
    let colorIndex = 0;
    const colors = ["#ffffff", "#ff3366", "#33ccff", "#ffcc00", "#00ff99"];
    const trailCount = 15; // Number of trail elements

    // Create initial trails
    for (let i = 0; i < trailCount; i++) {
      createTrail();
    }

    // Update mouse position
    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!effectEnabled) {
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
      }
    });

    // Expand cursor on click
    document.addEventListener("mousedown", function () {
      cursor.classList.add("expand");
    });

    document.addEventListener("mouseup", function () {
      cursor.classList.remove("expand");
    });

    // Toggle effect
    toggleBtn.addEventListener("click", function () {
      effectEnabled = !effectEnabled;
      this.textContent = effectEnabled ? "Disable Effect" : "Enable Effect";
    });

    // Change color
    colorBtn.addEventListener("click", function () {
      colorIndex = (colorIndex + 1) % colors.length;
      const newColor = colors[colorIndex];
      cursor.style.background = newColor;
      cursor.style.boxShadow = `0 0 20px ${newColor}, 0 0 40px ${newColor}`;

      document.querySelectorAll(".trail").forEach((trail) => {
        trail.style.background = newColor;
        trail.style.boxShadow = `0 0 15px ${newColor}`;
      });
    });

    // Clear trails
    clearBtn.addEventListener("click", function () {
      document.querySelectorAll(".trail").forEach((trail) => {
        trail.remove();
      });

      trails = [];

      for (let i = 0; i < trailCount; i++) {
        createTrail();
      }
    });

    // Create a trail element
    function createTrail() {
      const trail = document.createElement("div");
      trail.className = "trail";
      trail.style.opacity = 0;
      body.appendChild(trail);

      trails.push({
        element: trail,
        x: mouseX,
        y: mouseY,
        size: Math.random() * 4 + 4,
        speed: 0.1 + Math.random() * 0.1,
      });
    }

    // Animation loop
    function animate() {
      // Move cursor with easing if effect is enabled
      if (effectEnabled) {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + "px";
        cursor.style.top = cursorY + "px";
      }

      // Update trails
      let prevX = cursorX;
      let prevY = cursorY;

      trails.forEach((trail, index) => {
        // Calculate target position (cursor or previous trail)
        const targetX = prevX;
        const targetY = prevY;

        // Apply easing to trail position
        trail.x += (targetX - trail.x) * trail.speed;
        trail.y += (targetY - trail.y) * trail.speed;

        // Update trail element position
        trail.element.style.left = trail.x + "px";
        trail.element.style.top = trail.y + "px";

        // Calculate opacity based on position in trail
        const opacity = 1 - index / trails.length;
        trail.element.style.opacity = opacity;

        // Calculate size based on position in trail
        const scale = 1 - (index / trails.length) * 0.8;
        trail.element.style.width = `${trail.size * scale}px`;
        trail.element.style.height = `${trail.size * scale}px`;

        // Set current position as next target
        prevX = trail.x;
        prevY = trail.y;
      });

      requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Handle visibility change
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cursor.style.opacity = 0;
        document.querySelectorAll(".trail").forEach((trail) => {
          trail.style.opacity = 0;
        });
      } else {
        cursor.style.opacity = 1;
      }
    });
  });
  return (
    <div>
      <div className="content">
        <h1>Mouse Trail</h1>
      </div>
      <div className="cursor"></div>
      <div className="controls">
        <button id="toggle-effect">Toggle Effect</button>
        <button id="change-color">Change Color</button>
        <button id="clear-trails">Clear Trails</button>
      </div>
    </div>
  );
};

export default One;
