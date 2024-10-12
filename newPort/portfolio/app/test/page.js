import React from "react";
import img from "../public/flight.jpg";
import { FaGithub } from "react-icons/fa";
import { IoIosExit } from "react-icons/io";
import { MdCloseFullscreen } from "react-icons/md";

const page = () => {
  return (
    <div className="flex justify-center absolute mb-20  inset-0  w-full h-full z-40 backdrop-blur items-center">
      <div className="absolute right-10 text-2xl hover:underline active:text-base transition-all duration-200 top-10 z-50">
        <MdCloseFullscreen />
      </div>
      <div className="relative rounded-lg w-[90vw] sm:w-[80vw] md:w-[50vw] top-54 top-24 h-fit  z-50 inset-0 text-green-50 bg-[#171616]">
        <div
          style={{
            backgroundImage: `url(${img.src})`,
            backgroundSize: "cover",
            borderRadius: "10px",
            backgroundPosition: "center",
            height: "60vh",
            width: "50vw",
            objectFit: "cover",
          }}
        ></div>
        <div className="p-10">
          <div className="text-4xl ">Hello</div>
          <div className="flex pt-3">
            {" "}
            <span className="px-1 text-sm sm:text-base text-green-300 font-mono">
              Hello
            </span>
            <span className="px-1 text-sm sm:text-base text-green-300 font-mono">
              Hello
            </span>
            <span className="px-1 text-sm sm:text-base text-green-300 font-mono">
              Hello
            </span>
            <span className="px-1 text-sm sm:text-base text-green-300 font-mono">
              Hello
            </span>
          </div>
          <div className="py-3 test-base">
            Experience the thrill of live music with ease. At RockGaan, we bring
            you the best seats to the hottest concerts. Discover upcoming
            events, secure your tickets, and get ready for unforgettable
            performances by your favorite artists. Your next great concert
            experience starts here!
          </div>
          <div className="text-2xl py-3 ">Project Links.</div>
          <div className="flex ">
            <div className="flex hover:underline cursor-pointer text-green-300">
              <div className="mt-1 pr-1">
                <FaGithub />
              </div>
              <div className="">Source Code</div>
            </div>
            <div className="flex text-green-300 cursor-pointer hover:underline ml-5">
              <div className="mt-1 text-xl pr-1">
                <IoIosExit />
              </div>
              <div className=""> Live</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
