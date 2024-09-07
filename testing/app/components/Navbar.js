"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "../../public/logo2.png";
const Navbar = () => {
  return (
    <div className="flex ">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duraion: 1,
          type: "tween",
        }}
        className="flex pt-10 select-none"
      >
        <div className="h-10 ml-10">
          <Image
            src={logo}
            width={100}
            height={100}
            alt="Picture of the author"
          />
        </div>
        <div className="text-2xl mt-4 italic ml-[-8px]">MoveSeeks</div>
      </motion.div>
      <motion.button
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duraion: 1,
          type: "tween",
        }}
        className="px-5 mt-10 py-3 text-lg text-white bg-orange-700 hover:border-2 border-2 border-orange-700 hover:border-orange-700 hover:bg-orange-100 hover:text-orange-700 transition-colors duration-300 rounded-lg absolute right-[3rem]"
      >
        Sign in
      </motion.button>
    </div>
  );
};

export default Navbar;
