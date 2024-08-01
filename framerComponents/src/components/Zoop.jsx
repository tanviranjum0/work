"use client";
// import { motion } from "framer-motion";

// const RevealLinks = () => {
//   return (
//     <section className="grid h-screen place-content-center gap-2 bg-green-300 px-8 text-black">
//       <FlipLink href="#">Twitter</FlipLink>
//       <FlipLink href="#">facebook</FlipLink>
//       <FlipLink href="#">Instagram</FlipLink>
//       <FlipLink href="#">Linkedin</FlipLink>
//     </section>
//   );
// };
// export default RevealLinks;

// const FlipLink = ({ children, href }) => {
//   return (
//     <motion.a
//       initial="initial"
//       whileHover="hovered"
//       href={href}
//       className="relative bg-white block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl xl:text-9xl"
//     >
//       <motion.div
//         variants={{
//           initial: { y: 0 },
//           hovered: { y: "-100%" },
//         }}
//       >
//         {" "}
//         {children}
//       </motion.div>
//       <motion.div
//         className="absolute inset-0"
//         variants={{
//           initial: { y: "100%" },
//           hovered: { y: 0 },
//         }}
//       >
//         {" "}
//         {children}
//       </motion.div>
//     </motion.a>
//   );
// };

import { motion } from "framer-motion";

const RevealLinks = () => {
  return (
    <section className="grid h-screen place-content-center gap-2 bg-green-300 px-8 text-black">
      <FlipLink href="#">Twitter</FlipLink>
      <FlipLink href="#">facebook</FlipLink>
      <FlipLink href="#">Instagram</FlipLink>
      <FlipLink href="#">Linkedin</FlipLink>
    </section>
  );
};
export default RevealLinks;

const FlipLink = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative bg-white block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl xl:text-9xl"
    >
      <div>
        {" "}
        {children.split("").map((l, i) => {
          return (
            <motion.span
              className="inline-block"
              transition={{
                duration: 0.25,
                ease: "easeInOut",
                delay: 0.025 * i,
              }}
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => {
          return (
            <motion.span
              transition={{
                duration: 0.25,
                ease: "easeInOut",
                delay: 0.025 * i,
              }}
              className="inline-block"
              variants={{
                initial: { y: "100%" },
                hovered: { y: 0 },
              }}
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
    </motion.a>
  );
};
