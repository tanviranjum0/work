"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import img from "../../public/main.png";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className=" bg-[#d7f7f5] dark:bg-[#263859] lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <h1 className="text-black dark:text-[#C4D7F6] mx-auto px-10 mb-4 text-2xl sm:text-3xl lg:text-6xl lg:leading-normal font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
              Hello, I&apos;m{" "}
            </span>
            <br></br>
            <TypeAnimation
              sequence={[
                "Tanvir Anjum",
                1000,
                "Web Developer",
                1000,
                "Frontend Developer",
                1000,
                "UI/UX Designer",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </h1>
          <p className="text-[#223A60] dark:text-[#C4D7F6] px-10 text-base sm:text-lg mb-6 lg:text-xl">
            I am a student and I started programming as a hobby. Then I started
            my web development journey to take it to the next level.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-4 place-self-center mt-4 lg:mt-0"
        >
          <div className="rounded z-3 bg-[#181818] w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] relative">
            <Suspense
              fallback={
                <p className="text-3xl text-center font-semibold">
                  Loading...{" "}
                </p>
              }
            >
              {" "}
              <Image
                unoptimized
                src={img}
                alt="hero image"
                className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                width={300}
                height={300}
              />
            </Suspense>
          </div>
        </motion.div>
      </div>
      {/* <hr className="border-dashed border-2 bg-black w-full mt-3 mb-3" /> */}
    </section>
  );
};

export default HeroSection;
