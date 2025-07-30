"use client";
import React from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FiMessageCircle } from "react-icons/fi";
import { GiPathDistance } from "react-icons/gi";
import { PiMotorcycleFill } from "react-icons/pi";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import Link from "next/link";
interface IProps {
  sidebarOpenTab: string;
  openSidebar: boolean;
  setSidebarOpenTab: React.Dispatch<React.SetStateAction<string>>;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
const Sidebar = ({
  setOpenSidebar,
  openSidebar,
  setSidebarOpenTab,
  sidebarOpenTab,
}: IProps) => {
  return (
    <motion.div
      key={"navbar"}
      initial={{
        borderRadius: "100%",
        y: "-97%",
        x: "97%",
        scale: 0,
      }}
      animate={{
        x: "0%",
        scale: 1,
        y: "0%",
        opacity: 1,
        borderRadius: "0%",
      }}
      transition={{
        duration: 0.45,
        ease: "easeInOut",
      }}
      exit={{
        borderRadius: "100%",
        y: "-97%",
        x: "97%",
        scale: 0,
      }}
      className="h-[110vh] z-20 w-[100vw] overflow-hidden inset-0 text-black fixed bg-yellow-100"
    >
      <div
        onClick={() => setOpenSidebar(!openSidebar)}
        className="absolute right-14 top-14"
      >
        <HiOutlineBars3BottomRight className="text-2xl rotate-180 cursor-pointer" />
      </div>
      <div className="mt-16 mx-10 flex flex-col gap-5">
        <div>
          <div
            onClick={() => {
              if (sidebarOpenTab !== "Earn with AutoLane") {
                setSidebarOpenTab("Earn with AutoLane");
              } else {
                setSidebarOpenTab("");
              }
            }}
            className="flex items-center cursor-pointer"
          >
            Earn with AutoLane
            <ChevronDownIcon className="-mr-1 size-5 text-black font-bold" />
          </div>
          <AnimatePresence key={"animate presence earn with autolane"}>
            {sidebarOpenTab == "Earn with AutoLane" && (
              <motion.div
                key={"Earn with AutoLane"}
                exit={{ opacity: 0, height: 0 }}
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeInOut",
                }}
              >
                <Link
                  onClick={() => setOpenSidebar(false)}
                  href={"/earn/motorcycle"}
                  className="flex  hover:bg-yellow-200 hover:ml-3 transition-all duration-300  rounded-md cursor-pointer items-center text-sm mx-2"
                >
                  <PiMotorcycleFill className="border text-2xl m-2 text-yellow-600" />
                  <div className="">
                    <div>Earn using MOTORCYCLE</div>
                    <div className="text-xs">Be a rider</div>
                  </div>
                </Link>
                <Link
                  onClick={() => setOpenSidebar(false)}
                  href={"/earn/car"}
                  className="flex hover:bg-yellow-200 hover:ml-3 transition-all duration-300  rounded-md cursor-pointer items-center text-sm mx-2"
                >
                  <FaCar className="border text-2xl m-2 text-yellow-600" />
                  <div className="">
                    <div>Earn using CAR</div>
                    <div className="text-xs">Be a captain</div>
                  </div>
                </Link>
                <Link
                  onClick={() => setOpenSidebar(false)}
                  href={"/earn/cycle"}
                  className="flex hover:bg-yellow-200 hover:ml-3 transition-all duration-300  rounded-md cursor-pointer items-center text-sm mx-2"
                >
                  <IoIosBicycle className="border text-2xl m-2 text-yellow-600" />
                  <div className="">
                    <div className="">Earn using BICYCLE</div>
                    <div className="text-xs">Be a cyclist</div>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <div
            onClick={() => {
              if (sidebarOpenTab !== "Services") {
                setSidebarOpenTab("Services");
              } else {
                setSidebarOpenTab("");
              }
            }}
            className="flex items-center cursor-pointer"
          >
            Services{" "}
            <ChevronDownIcon className="-mr-1 size-5 text-black font-bold" />
          </div>
          <AnimatePresence key={"animate presence services"}>
            {sidebarOpenTab == "Services" && (
              <motion.div
                key={"Services"}
                exit={{ opacity: 0, height: 0 }}
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeInOut",
                }}
              >
                <div className="flex  hover:bg-yellow-200 hover:ml-3 transition-all duration-300  rounded-md cursor-pointer items-center text-sm mx-2">
                  <PiMotorcycleFill className="border text-2xl m-2 text-yellow-600" />
                  <div className="">
                    <div>MOTORCYCLE</div>
                    <div className="text-xs">Save time in Traffic</div>
                  </div>
                </div>
                <div className="flex hover:bg-yellow-200 hover:ml-3 transition-all duration-300  rounded-md cursor-pointer items-center text-sm mx-2">
                  <FaCar className="border text-2xl m-2 text-yellow-600" />
                  <div className="">
                    <div>CAR</div>
                    <div className="text-xs">Safe and Comfortable ride</div>
                  </div>
                </div>
                <div className="flex hover:bg-yellow-200 hover:ml-3 transition-all duration-300  rounded-md cursor-pointer items-center text-sm mx-2">
                  <GiPathDistance className="border text-2xl m-2 text-yellow-600" />
                  <div className="">
                    <div className="">PARCEL</div>
                    <div className="text-xs">Emergency devivary</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <div
            onClick={() => {
              if (sidebarOpenTab !== "Help") {
                setSidebarOpenTab("Help");
              } else {
                setSidebarOpenTab("");
              }
            }}
            className="flex items-center cursor-pointer"
          >
            Help
            <ChevronDownIcon className="-mr-1 size-5 text-black font-bold" />
          </div>
          <AnimatePresence>
            {sidebarOpenTab == "Help" && (
              <motion.div
                key={"Help"}
                exit={{ opacity: 0, height: 0 }}
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeInOut",
                }}
              >
                <div className="py-1 rounded-md ">
                  <Link
                    href="/"
                    className="block px-4 py-2 hover:bg-yellow-200 text-sm text-gray-700  "
                  >
                    User help center
                  </Link>

                  <Link
                    href="#"
                    className="block px-4 py-2 border-t-2 border-black hover:bg-yellow-200 text-sm text-gray-700 "
                  >
                    Rider/Captain help center
                  </Link>

                  <Link
                    href="#"
                    className="block border-t-2 border-black px-4 py-2 text-sm text-gray-700 "
                  >
                    <div className="flex gap-2 items-center">
                      <FiMessageCircle />
                      <span>Message Support</span>
                    </div>
                  </Link>

                  <Link
                    href="#"
                    className="block border-t-2 border-black px-4 py-2 text-sm text-gray-700 "
                  >
                    <div className="flex gap-2 items-center">
                      <FaPhoneAlt />
                      <span>Helpline +1 1111 1111 11</span>
                    </div>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <div className="flex items-center cursor-pointer">Blog</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
