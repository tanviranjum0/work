"use client";

import {
  motion,
  useMotionValue,
  animate,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

// export default function ScrollLogger() {
//   const { scrollYProgress } = useScroll();

//   useMotionValueEvent(scrollYProgress, "change", (latest) => {
//     console.log("Scroll Progress:", latest);
//   });

//   return (
//     <motion.div
//       style={{ height: "200vh", background: "linear-gradient(#f00, #00f)" }}
//     >
//       Scroll and check console logs!
//     </motion.div>
//   );
// }

// export default function AnimationEvents() {
//   const x = useMotionValue(0);

//   useMotionValueEvent(x, "animationStart", () => {
//     console.log("Animation started!");
//   });

//   useMotionValueEvent(x, "animationComplete", () => {
//     console.log("Animation completed!");
//   });

//   return (
//     <button
//       onClick={() => animate(x, 200, { duration: 1 })}
//       style={{ padding: "10px 20px", cursor: "pointer" }}
//     >
//       Animate X
//       <motion.div
//         style={{
//           width: 50,
//           height: 50,
//           background: "limegreen",
//           x,
//           marginTop: 20,
//         }}
//       />
//     </button>
//   );
// }

export default function VelocityTracker() {
  const x = useMotionValue(0);

  useMotionValueEvent(x, "change", (latest) => {
    console.log("Position:", latest, "Velocity:", x.getVelocity());
  });

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      style={{
        width: 100,
        height: 100,
        background: "orange",
        borderRadius: 20,
        x,
      }}
    />
  );
}
