"use client";
import Link from "next/link";
import NavbarMobile from "./NavbarMobile";
import MenuOverlay from "./MenuOverlay";
import { IoIosSunny, IoMdMoon } from "react-icons/io";
// import { IoMdMoon } from "react-icons/io";
import { useState } from "react";
const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [icon, setIcon] = useState(false);
  const darkModeEnabled = () => {
    const html = document.querySelector("html");
    let result = html.classList.contains("dark");
    html.classList.toggle("dark");
    setIcon(!result);
  };
  // const toggleDarkMode = () => {
  //   const html = document.querySelector("html");
  //   html.classList.toggle("dark");
  // };
  return (
    <div>
      {!navbarOpen ? (
        <div className="sticky top-0 w-full z-100 shadow-lg mx-auto md:h-[5rem] items-center dark:bg-[#17223B]  bg-[#B9F0F2]">
          {" "}
          <div className="flex md:flex-row justify-around md:w-10/12 w-full items-baseline">
            {" "}
            <div className="py-2 md:py-3 md:pt-[1rem] md:basis-1/4 basis-[100%]  text-xl md:text-4xl text-[#223A60] dark:text-[#C4D7F6] font-semibold text-center items-center mx-auto ">
              <Link href={"/"}>Tanvir Anjum</Link>
            </div>
            <ul className="hidden md:flex-row md:flex font-medium md:basis-[2/4-20px] items-baseline list-unstyled gap-x-6">
              <li>
                {" "}
                <Link href="/">HOME</Link>
              </li>
              <li>
                {" "}
                <Link href="/#about">ABOUT</Link>
              </li>
              <li>
                {" "}
                <Link href="/#work">WORK</Link>
              </li>
              <li>
                {" "}
                <Link href="/#contact">CONTACT</Link>
              </li>
            </ul>
            <div className="md:basis-[1/4-20px] flex items-baseline md:block text-2xl   basis-[2/4-20px]">
              {" "}
              <div>
                {" "}
                {icon ? (
                  <IoIosSunny
                    className=" hover:cursor-pointer text-2xl md:mt-3 md:ml-4 my-auto dark:text-[#C4D7F6]"
                    onClick={() => {
                      darkModeEnabled();
                    }}
                  />
                ) : (
                  <IoMdMoon
                    className=" hover:cursor-pointer text-2xl md:mt-3 md:ml-4 my-auto dark:text-[#C4D7F6]"
                    onClick={() => {
                      darkModeEnabled();
                    }}
                  />
                )}
              </div>
              <NavbarMobile
                navbarOpen={navbarOpen}
                setNavbarOpen={setNavbarOpen}
                className="my-auto md:hidden"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          {" "}
          <NavbarMobile
            navbarOpen={navbarOpen}
            setNavbarOpen={setNavbarOpen}
            className="my-auto"
          />
          <MenuOverlay setNavbarOpen={setNavbarOpen} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
