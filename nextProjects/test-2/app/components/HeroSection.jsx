import React from "react";
import img from "@/public/images/hero-image.png";
import Image from "next/image";
import TextAnim from "./TextAnim";
// import Link from "next/link";
const HeroSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 text-white">
      <div className="col-span-7 place-self-center text-center">
        <h1 className="text-4xl mb-4 lg:text-6xl text-white sm:text-5xl font-extrabold">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-purple-500 to-violet-100">
            {" "}
            Hello ! I am{" "}
          </span>
          <TextAnim />
        </h1>
        <p className="text-lg text-white  mb-6 lg:text-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
          culpa ratione laborum minus ad non. Assumenda at dolor molestiae
          quaerat.
        </p>
        <div>
          <button className="font-bold bg-gradient-to-br from-blue-500 via-purple-400 to-cyan-300 px-6 py-3 my-2 w-full sm:w-fit rounded-full mr-4 hover:bg-slate-400 bg-white text-black ">
            Hire Me
          </button>
          <button className="font-bold px-1 py-1 w-full sm:w-fit rounded-full bg-gradient-to-br from-blue-500 via-purple-400 to-cyan-300 hover:bg-slate-800 ">
            <span className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2">
              Download CV
            </span>
          </button>
        </div>
      </div>
      <div className="col-span-5 place-self-center mt-4 lg:mt-0">
        <div className="rounder-full w-[250px] h-[250px]  relative">
          <Image
            className="absolute mt-12 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            src={img}
            alt="Hero Image"
            width={300}
            height={300}
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
