"use client";
import React from "react";
// import { IoIosSunny } from "react-icons/io";
// import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const NavbarMobile = ({ navbarOpen, setNavbarOpen }) => {
  return (
    <div>
      {!navbarOpen ? (
        <div className="md:hidden flex">
          <button
            onClick={() => setNavbarOpen(true)}
            className="flex items-center px-3 py-2  text-black rounded   hover:text-gray-500 hover:border-slate-900"
          >
            <Bars3Icon className="w-7 h-7 dark:text-[#C4D7F6]" />
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setNavbarOpen(false)}
            className="flex items-center px-3 py-2  text-black rounded hover:text-gray-500 hover:border-slate-900"
          >
            <XMarkIcon className="absolute right-1 mt-8 mx-3 h-6 w-6 dark:text-[#C4D7F6]" />
          </button>
        </div>
      )}
      {/* {navbarOpen && <MenuOverlay toggleDarkMode={toggleDarkMode} />} */}
    </div>
  );
};

export default NavbarMobile;
