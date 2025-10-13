"use client";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
const Footer = () => {
  const mainContainer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mainContainer,
    offset: ["start end", "end start"],
  });
  const margin = useTransform(scrollYProgress, [0, 1], [80, 160]);
  // console.log(margin);
  return (
    <div className="h-[100vh] text-white bg-image-footer -z-10 box-border w-full  flex justify-center items-center">
      <motion.div
        ref={mainContainer}
        style={{
          margin,
        }}
        className="h-full w-full opacity-100 bg-linear-to-r/oklch from-indigo-500 to-teal-400 rounded-4xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="p-20 flex flex-col gap-20 justify-between">
            <div className="">
              <div className="text-5xl pb-10">Tell me about your project</div>
              <div className="flex flex-col gap-2">
                <div className="text-xl gap-2 flex items-center">
                  <IoShieldCheckmarkSharp />
                  <span>I will respond you within 12 hours</span>
                </div>
                <div className="text-xl gap-2 flex items-center">
                  <IoShieldCheckmarkSharp />
                  <span>I will sign an NDA if requested</span>
                </div>
                <div className="text-xl gap-2 flex items-center">
                  <IoShieldCheckmarkSharp />
                  <span>Access to dedicated consultant specialist</span>
                </div>
              </div>
            </div>
            <div className=" flex flex-col gap-5">
              <div className="my-2 cursor-pointer">
                tanviranjum010@gmail.com
              </div>
              <div className="text-xl">
                Always busy and want to book an exact time to call?
              </div>
              <div className="rounded-full cursor-pointer w-52 text-center font-bold p-3 bg-cyan-400">
                Book a call for free
              </div>
            </div>
          </div>
          <div className=""></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Footer;
