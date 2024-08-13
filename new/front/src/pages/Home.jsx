// import Navbar from "../components/moleculas/Navbar"
import { motion } from "framer-motion";
import HeroSection from "../components/moleculas/HeroSection";
import UpcomingEvents from "../components/moleculas/UpcomingEvents";
import Merchandising from "../components/moleculas/Merchandising";
import AboutSection from "../components/moleculas/AboutSection";
import Footer from "../components/moleculas/Footer";
const Home = () => {
  return (
    <div className="bg-[#0f1012] text-slate-400">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        {" "}
        <HeroSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <UpcomingEvents />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <Merchandising />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <AboutSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default Home;
