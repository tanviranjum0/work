"use client";
import { motion } from "framer-motion";
const page = () => {
  return (
    <div className="flex justify-center items-center h-[100vh] w-[100vw] shadow">
      <div
        style={{
          position: "relative",
          width: 50,
          height: 50,
        }}
      >
        <motion.span
          key={"mainlader"}
          style={{
            opacity: 2,
            display: "block",
            width: 50,
            height: 50,
            border: "7px solid #eee",
            borderTop: "7px solid #2D3134",
            borderRadius: "50%",
            boxSizing: "border-box",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            ease: "easeInOut",
            // width: ['100%', '50%'],
            duration: 1,
          }}
        />
      </div>
    </div>
  );
};

export default page;
