import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const HideNav = ({ children }) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

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
        duration: 0.25,
        ease: "easeInOut",
      }}
      className="sticky top-0 flex z-50 items-center justify-center"
    >
      {children}
    </motion.div>
  );
};
export default HideNav;
