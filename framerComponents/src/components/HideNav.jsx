import { useEffect, useState } from "react";
import Hero from "../compos/Hero";
import Nav from "../compos/Nav";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const HideNav = () => {
  return (
    <div>
      <Navigation />
      <Hero />
    </div>
  );
};

export default HideNav;
const Navigation = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  // useEffect(() => {
  //   const unsub = scrollY.on("change", (latest) => console.log(latest));
  //   return () => unsub();
  // }, [scrollY]);
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
        duration: 0.35,
        ease: "easeInOut",
      }}
      className="sticky top-0 flex items-center justify-center"
    >
      <Nav />
    </motion.div>
  );
};
