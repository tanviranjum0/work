"use client";
import { ReactNode, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

const HideNav = ({ children }: { children: ReactNode }) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      variants={{
        visible: {
          y: 0,
        },
        hidden: {
          y: "-100%",
        },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className=" bg-yellow-500 sticky top-0 flex z-50 items-center justify-center"
    >
      {children}
    </motion.div>
  );
};
export default HideNav;
