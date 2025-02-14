"use client";
import React, { useState } from "react";
import logo from "../../public/logo.jpg";
import { FiMessageCircle } from "react-icons/fi";
import { PiMotorcycleFill } from "react-icons/pi";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import Link from "next/link";
import HideNav from "../motion/HideNav";
import Sidebar from "./Sidebar";
const Navbar = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [sidebarOpenTab, setSidebarOpenTab] = useState<string>("");
  const [isHover, toggleHover] = useState({
    earn: false,
    services: false,
    help: false,
  });
  const toggleHoverMenu = (section: string) => {
    if (section == "earn") {
      toggleHover((prev) => ({ ...prev, earn: !prev.earn }));
    } else if (section == "services") {
      toggleHover((prev) => ({ ...prev, services: !prev.services }));
    } else if (section == "help") {
      toggleHover((prev) => ({ ...prev, help: !prev.help }));
    }
  };

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.5,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.4,
        delay: 0.2,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };
  return (
    <HideNav>
      <div className="font-semibold transition-all duration-300 h-20 select-none flex justify-center items-center ">
        <div className="w-[80vw] flex justify-between">
          <Link href={"/"} className="flex gap-2 items-center">
            <Image
              draggable="false"
              src={logo}
              className="border rounded-full"
              width={50}
              height={50}
              alt="logo"
            />
            <span className="text-2xl text-zinc-700 font-bold font-mono italic">
              AutoLane
            </span>
          </Link>
          <div
            onClick={() => setOpenSidebar(!openSidebar)}
            className="flex rounded justify-center p-3 sm:hidden items-center"
          >
            <HiOutlineBars3BottomRight className="text-2xl cursor-pointer" />
          </div>
          <AnimatePresence key={"navbar animate presence"}>
            {openSidebar && (
              <Sidebar
                openSidebar={openSidebar}
                setOpenSidebar={setOpenSidebar}
                setSidebarOpenTab={setSidebarOpenTab}
                sidebarOpenTab={sidebarOpenTab}
              />
            )}
          </AnimatePresence>
          <div className="hidden cursor-pointer justify-center items-center gap-4 sm:grid sm:grid-cols-4">
            <motion.div
              onHoverStart={() => toggleHoverMenu("earn")}
              onHoverEnd={() => toggleHoverMenu("earn")}
            >
              <div className="flex items-center justify-center">
                {" "}
                <span>Earn</span>
                <FaAngleDown className="text-xs ml-2" />
              </div>
              <motion.div
                className="sub-menu"
                initial="exit"
                animate={isHover.earn ? "enter" : "exit"}
                variants={subMenuAnimate}
              >
                <div className="bg-yellow-100">
                  <Link
                    href={"/earn/motorcycle"}
                    className="flex hover:bg-yellow-200 hover:ml-2 transition-all duration-300  rounded-md cursor-pointer items-center text-sm"
                  >
                    <PiMotorcycleFill className="border text-2xl m-2 " />
                    <div className="cursor-pointer p-2 transition-all duration-300 hover:bg-yellow-200">
                      <div>Earn using MOTORCYCLE</div>
                      <div className="text-xs">Be a rider</div>
                    </div>
                  </Link>

                  <Link
                    href={"/earn/car"}
                    className="flex hover:bg-yellow-200 hover:ml-2 transition-all duration-300  rounded-md cursor-pointer items-center text-sm"
                  >
                    <FaCar className="border text-2xl m-2 " />
                    <div className="cursor-pointer p-2 transition-all duration-300 hover:bg-yellow-200">
                      <div>Earn using Car</div>
                      <div className="text-xs">Be a captain</div>
                    </div>
                  </Link>
                  <Link
                    href={"/earn/cycle"}
                    className="flex hover:bg-yellow-200 hover:ml-2 transition-all duration-300  rounded-md cursor-pointer items-center text-sm"
                  >
                    <IoIosBicycle className="border text-2xl m-2 " />
                    <div className="cursor-pointer p-2 transition-all duration-300 hover:bg-yellow-200">
                      <div>Earn using Cycle</div>
                      <div className="text-xs">Be a cyclist</div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              onHoverStart={() => toggleHoverMenu("services")}
              onHoverEnd={() => toggleHoverMenu("services")}
            >
              <div className="flex items-center justify-center">
                {" "}
                <span className="">Services</span>
                <FaAngleDown className="text-xs ml-2" />
              </div>

              <motion.div
                className="sub-menu"
                initial="exit"
                animate={isHover.services ? "enter" : "exit"}
                variants={subMenuAnimate}
              >
                <div className="bg-yellow-100">
                  <Link
                    href={"/motorcycle"}
                    className="flex hover:bg-yellow-200 hover:ml-2 transition-all duration-300  rounded-md cursor-pointer items-center text-sm"
                  >
                    <PiMotorcycleFill className="border text-2xl m-2 " />
                    <div className="cursor-pointer p-2 transition-all duration-300 hover:bg-yellow-200">
                      <div>MOTORCYCLE</div>
                      <div className="text-xs">Beat the traffic, Save time</div>
                    </div>
                  </Link>
                  <Link
                    href={"/car"}
                    className="flex hover:bg-yellow-200 hover:ml-2 transition-all duration-300  rounded-md cursor-pointer items-center text-sm"
                  >
                    <FaCar className="border text-2xl m-2 " />
                    <div className="cursor-pointer p-2 transition-all duration-300 hover:bg-yellow-200">
                      <div>Car</div>
                      <div className="text-xs">
                        Travel in comfort, at your convenience
                      </div>
                    </div>
                  </Link>
                  <Link
                    href={"/food"}
                    className="flex hover:bg-yellow-200 hover:ml-2 transition-all duration-300  rounded-md cursor-pointer items-center text-sm"
                  >
                    <IoIosBicycle className="border text-2xl m-2 " />
                    <div className="cursor-pointer p-2 transition-all duration-300 hover:bg-yellow-200">
                      <div>Food</div>
                      <div className="text-xs">
                        Get your food in less than an hour
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="ml-5"
              onHoverStart={() => toggleHoverMenu("help")}
              onHoverEnd={() => toggleHoverMenu("help")}
            >
              <div className="flex justify-center items-center">
                {" "}
                <span>Help</span>
                <FaAngleDown className="text-xs ml-2" />
              </div>

              <motion.div
                className="sub-menu"
                initial="exit"
                animate={isHover.help ? "enter" : "exit"}
                variants={subMenuAnimate}
              >
                <div className="bg-yellow-100">
                  <div className="py-1 rounded-md ">
                    <a
                      href="#"
                      className="block hover:ml-2 rounded transition-all duration-300 px-4 py-2 hover:bg-yellow-200 text-sm "
                    >
                      User help center
                    </a>
                    <a
                      href="#"
                      className="block hover:ml-2 rounded transition-all duration-300 px-4 py-2 hover:bg-yellow-200 text-sm "
                    >
                      Rider/Captain help center
                    </a>
                    <a
                      href="#"
                      className="block hover:ml-2 transition-all duration-300 border-t-2 border-blackpx-4 py-2 text-sm "
                    >
                      <div className="flex gap-2 items-center">
                        <FiMessageCircle />
                        <span>Message Support</span>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="block hover:ml-2 transition-all duration-300 border-t-2 border-blackpx-4 py-2 text-sm "
                    >
                      <div className="flex gap-2 items-center">
                        <FaPhoneAlt />
                        <span>Helpline +1 1111 1111 11</span>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <div>
              <div className="flex justify-center items-center">
                <span>Blog</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HideNav>
  );
};

export default Navbar;
