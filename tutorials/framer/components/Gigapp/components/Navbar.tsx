"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import logo from "../../../public/logo3.png";
import { useEffect } from "react";

const Navbar = () => {
  useEffect(() => {
    const displayTime = document.querySelector(".display-time") as HTMLElement;
    // Time
    function showTime() {
      let time = new Date();
      if (!displayTime) return;
      displayTime.innerText = time.toLocaleTimeString("en-US", {
        hour12: true,
      });
      setTimeout(showTime, 1000);
    }
    showTime();
  }, []);
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex justify-center items-center">
          <Image
            alt="logo"
            className="rounded-full"
            src={logo}
            width={50}
            height={50}
          />
          <div className="">
            {/* <div className="">Availability</div>
            <div className="live-indicator-block">
              <span className="live-indicator">
                <i className="fa fa-circle blink" aria-hidden="true"></i>Live
              </span>
            </div> */}
            <div>Availability</div>
            <div className="flex justify-center items-center gap-2">
              {" "}
              <motion.div
                key={"New"}
                className="bg-red-500 rounded-full w-3 h-3"
                initial={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              ></motion.div>
              <div>Available for work</div>
            </div>
          </div>

          <div className="">
            <div className="">Local Time</div>
            <div className="display-time"></div>
          </div>
        </div>
        <div className="flex justify-around items-center">
          <div className="btn2 px-3/2 w-20 py-1">Facebook</div>
          <div className="btn2 px-3/2 w-20 py-1">Linkedin</div>
          <div className="btn2 px-3/2 w-20 py-1">Fiverr</div>
          <div className="btn2 px-3/2 w-20 py-1">Github</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
