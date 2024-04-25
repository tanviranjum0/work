"use client";
import React, { useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import MenuOverlay from "./MenuOverlay";
const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navLinks = [
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-90">
      <div className=" text-white flex flex-wrap items-center justify-between mx-auto py-1">
        <Link href="/" className="text-4xl font-semibold">
          Logo
        </Link>
        <div className="mobile-menu block md:hidden">
          {!navbarOpen ? (
            <button onClick={() => setNavbarOpen(true)}>
              <span className="h-5 w-5 px-3 py-2 outline">Links</span>
            </button>
          ) : (
            <button onClick={() => setNavbarOpen(false)}>
              {" "}
              <span className="h-5 w-5 outline px-3 text-bold text-2xl">X</span>
            </button>
          )}
        </div>
        <div className="menu hidden md:width-auto md:block" id="Navbar">
          <ul className="p-4 flex flex-row md:p-0">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink href={link.href} title={link.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {navbarOpen ? <MenuOverlay links={navLinks} /> : null}
    </nav>
  );
};

export default Navbar;
