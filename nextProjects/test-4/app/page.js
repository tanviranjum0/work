"use client";
import { motion } from "framer-motion";
import { useState } from "react";
// import Image from "next/image";
// import { TypeAnimation } from "react-type-animation";
// import fav from "./favicon.ico";
// const variants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1 },
// };
const page = () => {
  const [rotate, setRotate] = useState(false);
  return (
    <>
      <div className="my-10 overlay h-10 p-5 m-2 text-bold w-full">
        Hello World
      </div>
      <motion.div
        className="h-40 w-40 border border-black bg-violet-600 flex mx-auto my-20 rounded"
        // initial={{ opacity: 0, scale: 0 }}
        // animate={{ opacity: 1, scale: 1 }}
        // transition={{ duration: 1 }}
        // transition={{ type: "inertia", velocity:  }}
        // animate={{ x: rotate ? 200 : -200 }}
        // onClick={() => setRotate(!rotate)}
        // whileHover={{ scale: 2 }}
        // drag="y"
        // drag
        // dragConstraints={{ left: 50, right: 50, top: 50, bottom: 50 }}
        // whileDrag={{ scale: 1.5 }}
        // animate={{ rotate: [0, 200, 200, 0], x: [0, 200, 200, 0, -200, -200, 0] }}
        // transition={{ repeat: Infinity, duration: 1 }}
      >
        {/* <TypeAnimation
        className=" m-20 w-100 text-center text-bold p-10 bg-blue-400 italic"
        sequence={[
          "Judy",
          1000,
          "Web Developer",
          1000,
          "Mobile Developer",
          1000,
          "UI/UX Designer",
          1000,
        ]}
        wrapper="span"
        speed={10}
        repeat={2}
      /> */}
        {/* <div className="m-5 bg-red-700">
        {" "}
        <Image src={fav} alt="Nothing" height={100} width={100}></Image>
      </div>
      <div className="m-5 bg-red-700"> </div>
      <div className="m-5 bg-red-700">
        {" "}
        <Image src={fav} alt="Nothing" height={100} width={100}></Image>
      </div>
      <div className="m-5 bg-red-700">
        {" "}
        <Image src={fav} alt="Nothing" height={100} width={100}></Image>
      </div> */}
      </motion.div>
    </>
  );
};

export default page;
