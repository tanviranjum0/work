"use client";
import { motion, useScroll, useTransform, useMotionValue } from "motion/react";
import { useEffect } from "react";

// export default function ScrollOpacity() {
//   const { scrollYProgress } = useScroll();
//   // Map 0 → 1 scroll progress to opacity 1 → 0
//   const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
//   return (
//     <motion.div
//       style={{
//         height: "150vh",
//         background: "tomato",
//         opacity,
//       }}
//     >
//       Fade out as you scroll down
//     </motion.div>
//   );
// }

// export default function Parallax() {
//   const { scrollY } = useScroll();
//   // Map scroll distance to translateY
//   const y = useTransform(scrollY, [0, 300], [0, -150]);

//   return (
//     <motion.div
//       style={{
//         height: 200,
//         width: "100%",
//         background: "linear-gradient(to right, #00f, #0ff)",
//         y,
//       }}
//     >
//       Parallax Section
//     </motion.div>
//   );
// }

export default function CombinedValues() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Derived value = distance from origin
  const distance = useTransform([x, y], ([latestX, latestY]) =>
    Math.sqrt(latestX ** 2 + latestY ** 2)
  );
  useEffect(() => {
    console.log(distance);
  }, [x, y]);
  return (
    <motion.div
      drag
      style={{
        width: 100,
        height: 100,
        background: "purple",
        x,
        y,
      }}
    >
      Distance: {distance.get().toFixed(0)}
    </motion.div>
  );
}
