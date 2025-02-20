"use client";
import React, { useState } from "react";
import logo from "../../public/logo.jpg";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

interface footerLinksType {
  Platform: Array<{ name: string; href: string }>;
  Earn: Array<{ name: string; href: string }>;
  Help: Array<{ name: string; href: string }>;
  Marchant: Array<{ name: string; href: string }>;
}
const Footer = () => {
  const [openAccordion, setOpenAccordion] = useState<{
    Platform: boolean;
    Earn: boolean;
    Marchant: boolean;
    Help: boolean;
  }>({
    Platform: false,
    Earn: false,
    Marchant: false,
    Help: false,
  });

  const footerLinks: footerLinksType = {
    Platform: [
      { name: "AutoLane Bike", href: "/motorcycle" },
      { name: "AutoLane Car", href: "/car" },
      { name: "AutoLane Food", href: "/food" },
      { name: "AutoLane Shop", href: "/" },
      { name: "AutoLane Parcel", href: "/parcel" },
      { name: "AutoLane Couriers", href: "/" },
      { name: "AutoLane Rental", href: "/" },
      { name: "AutoLane Maps", href: "/" },
    ],
    Earn: [
      { name: "Earn with Bike", href: "/earn/motorcycle" },
      { name: "Earn with Car", href: "/earn/car" },
      { name: "Earn with Cycle", href: "/earn/cycle" },
    ],
    Marchant: [
      { name: "Courier Marchant Sign Up", href: "/" },
      { name: "Courier Marchant Login", href: "/" },
      { name: "Car Admiral Login", href: "/" },
      { name: "Resto Marchant Sign Up ", href: "/" },
      { name: "Resto Marchant Login", href: "/" },
    ],
    Help: [
      { name: "Walk in support center", href: "/" },
      { name: "User Help Center", href: "/" },
      { name: "Rider Help Center", href: "/" },
      { name: "Marchant Help Center", href: "/" },
      { name: "Live Chat for Driver", href: "/" },
      { name: "Helpline +1111 111 11", href: "/" },
      { name: "Emergency helpline +12345", href: "/" },
    ],
  };

  return (
    <div className="text-white bg-zinc-900">
      <div className="w-[90vw] border-b-2 mx-auto p-10 grid justify-center md:grid-cols-2 lg:grid-cols-4 md:gap-5 ">
        <div className="md:p-3 text-center">
          <div
            onClick={() =>
              setOpenAccordion((prev) => ({
                Platform: !prev.Platform,
                Earn: false,
                Marchant: false,
                Help: false,
              }))
            }
            className="text-2xl font-semibold md:py-4 py-1 cursor-pointer "
          >
            Platform
          </div>
          <AnimatePresence>
            {openAccordion.Platform && (
              <motion.ul
                key={"platformSection"}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: openAccordion.Platform ? 1 : 0,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "linear",
                  type: "tween",
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                className="list-none"
              >
                {footerLinks.Platform.map((item, i) => (
                  <motion.li
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.1,
                      ease: "linear",
                      type: "tween",
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    key={item.name}
                    className="py-1 hover:underline cursor-pointer"
                  >
                    <Link href={item.href}> {item.name}</Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          <ul className="list-none Platform hidden md:block">
            {footerLinks.Platform.map((item, i) => (
              <motion.li
                key={item.name}
                className="py-1 hover:underline cursor-pointer"
              >
                <Link href={item.href}> {item.name}</Link>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="md:p-3 text-center">
          <div
            onClick={() =>
              setOpenAccordion((prev) => ({
                Platform: false,
                Earn: !prev.Earn,
                Marchant: false,
                Help: false,
              }))
            }
            className="text-2xl font-semibold md:py-4 py-1 cursor-pointer md:cursor-defalit"
          >
            Earn
          </div>
          <AnimatePresence key={"animate presence earn"}>
            {openAccordion.Earn && (
              <motion.ul
                key={"earnSection"}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: openAccordion.Earn ? 1 : 0,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "linear",
                  type: "tween",
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                className="list-none"
              >
                {footerLinks.Earn.map((item: { name: string }, i) => (
                  <motion.li
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.1,
                      ease: "linear",
                      type: "tween",
                    }}
                    key={item.name}
                    className="py-1 hover:underline cursor-pointer"
                  >
                    <Link href={item.href}> {item.name}</Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          <ul className="list-none Earn hidden md:block">
            {footerLinks.Earn.map((item) => (
              <li
                key={item.name}
                className="py-1 hover:underline cursor-pointer"
              >
                <Link href={item.href}> {item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:p-3 text-center">
          <div
            onClick={() =>
              setOpenAccordion((prev) => ({
                Platform: false,
                Earn: false,
                Marchant: !prev.Marchant,
                Help: false,
              }))
            }
            className="text-2xl font-semibold md:py-4 py-1 cursor-pointer md:cursor-defalit"
          >
            Marchant
          </div>
          <AnimatePresence key={"animate presence marchant"}>
            {openAccordion.Marchant && (
              <motion.ul
                key={"marchantSection"}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: openAccordion.Marchant ? 1 : 0,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "linear",
                  type: "tween",
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                className="list-none"
              >
                {footerLinks.Marchant.map((item, i) => (
                  <motion.li
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.1,
                      ease: "linear",
                      type: "tween",
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    key={item.name}
                    className="py-1 hover:underline cursor-pointer"
                  >
                    <Link href={item.href}> {item.name}</Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          <ul className="list-none Marchant hidden md:block">
            {footerLinks.Marchant.map((item) => (
              <li
                key={item.name}
                className="py-1 hover:underline cursor-pointer"
              >
                <Link href={item.href}> {item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center md:p-3">
          <div
            onClick={() =>
              setOpenAccordion((prev) => ({
                Platform: false,
                Earn: false,
                Marchant: false,
                Help: !prev.Help,
              }))
            }
            className="text-2xl font-semibold md:py-4 py-1 cursor-pointer md:cursor-defalit"
          >
            Help
          </div>
          <AnimatePresence key={"animate presence help"}>
            {openAccordion.Help && (
              <motion.ul
                key={"HelpSection"}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: openAccordion.Help ? 1 : 0,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "linear",
                  type: "tween",
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                className="list-none"
              >
                {footerLinks.Help.map((item, i) => (
                  <motion.li
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.1,
                      ease: "linear",
                      type: "tween",
                    }}
                    key={item.name}
                    className="py-1 hover:underline cursor-pointer"
                  >
                    <Link href={item.href}> {item.name}</Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          <ul className="list-none Help hidden md:block">
            {footerLinks.Help.map((item) => (
              <li
                key={item.name}
                className="py-1 hover:underline cursor-pointer"
              >
                <Link href={item.href}> {item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="py-5  border-b-2 w-[80vw] mx-auto">
        <div className="flex items-center justify-between">
          <Link href={"/"} className="flex  cursor-pointer items-center">
            <Image
              draggable="false"
              src={logo}
              className="border rounded-flil"
              width={40}
              height={40}
              alt="logo"
            />
            <div className="md:text-2xl  px-1 md:px-3">AutoLane</div>
          </Link>
          <div className="sm:px-3 px-1 text-sm  justify-center gap-1 sm:gap-4 flex">
            <div className="md:text-xl hover:underline cursor-pointer">
              About us
            </div>
            <div className="md:text-xl hover:underline cursor-pointer">
              Blog
            </div>
            <div className="md:text-xl hover:underline cursor-pointer">
              Contact
            </div>
            <div className="md:text-xl hover:underline cursor-pointer">T/C</div>
          </div>
        </div>
      </div>
      <div className="text-sm pb-10 mt-10 text-center">
        © 2015-2025 AutoLane Ltd. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
