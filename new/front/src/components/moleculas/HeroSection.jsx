import { FaClock } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import GetTicket from "../atoms/GetTicket";
import { motion } from "framer-motion";
const HeroSection = () => {
  return (
    <div>
      <div className="main-bg min-h-[100vh] mx-auto flex flex-col md:flex-row pt-10 gap-32 items-center justify-center ">
        <motion.div
          initial={{ y: 500, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1,
            ease: "linear",
            type: "tween",
            delay: 0.5,
          }}
          className=" flex flex-col "
        >
          <div className="get-ticket mb-10">
            <GetTicket />
          </div>
          <div className="flex gap-4 text-xl">
            <div className="text-[#DAF7A6] mix-blend-difference flex ">
              <FaClock className="mt-1 mx-1" />
              Friday, 6 September, 2024
            </div>
            <div className="text-[#DAF7A6] flex">
              <IoLocationSharp className="mt-1" />
              Barcelona, Spain
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: -600, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1,
            ease: "linear",
            type: "tween",
            delay: 0.5,
          }}
          className=" flex flex-col "
        >
          <div className="text-7xl text-slate-300 text-center shadow-lg">
            NACHIKETA
          </div>
          <div className="text-5xl text-slate-400">LIVE IN BARCELONA</div>
          <div className="text-2xl text-center text-slate-400 font-mono">
            With{" "}
            <div className="text-7xl text-red-400">
              <i>James Bond</i>
            </div>{" "}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
