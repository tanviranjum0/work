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
          <div className="p-20 flex flex-col justify-between">
            <div className="">
              {" "}
              <div className="">
                <div className="text-2xl">Service</div>
                <div className="flex gap-2">
                  <span className="footerBtn py-1 px-1.5">Consulting</span>
                  <span className="footerBtn py-1 px-1.5">Website</span>
                  <span className="footerBtn py-1 px-1.5">Animation</span>
                  <span className="footerBtn py-1 px-1.5">Backend</span>
                </div>
              </div>
              <div className="">
                <div className="text-2xl">Budget</div>
                <div className="flex gap-2">
                  <span className="footerBtn py-1 px-1.5">Less than $10k</span>
                  <span className="footerBtn py-1 px-1.5">$10k to $50k</span>
                  <span className="footerBtn py-1 px-1.5">More than $50k</span>
                </div>
              </div>
            </div>
            <form autoComplete="on" className="mx-auto w-full">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email"
                  className="peer-focus:font-medium absolute text-sm   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-200 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="message"
                  id="message"
                  className="block py-2.5 px-0 w-full  bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="message"
                  className="peer-focus:font-medium absolute text-sm   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-200 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  {/* Message */}
                </label>
              </div>
              <div className="">
                <div className="text-2xl">Attach a file(optional)</div>
              </div>
              <button className="rounded-2xl min-w-max sm:w-full border-2  border-green-400 bg-green-400 px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
                Send
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Footer;
