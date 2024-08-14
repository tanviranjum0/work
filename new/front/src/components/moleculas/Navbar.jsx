import React from "react";
import HideNav from "../motions/HideNav";
import svg from "../../assets/music-icon.svg";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import userSvg from "../../assets/user.svg";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import classNames from "classnames";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
let navigation = [
  { name: "Home", href: "/", current: true },
  { name: "About", href: "/about", current: false },
  { name: "Contact", href: "/contact", current: false },
];

const Navbar = () => {
  return (
    <HideNav key="mainnav">
      <Disclosure as="nav" className="bg-gray-800  w-full">
        <div className="mx-auto w-full px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-center">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between ">
              <Link to={"/"} className="flex flex-shrink-0 items-center">
                <img alt="Your Company" src={svg} className="h-8 w-auto" />

                <motion.div
                  key={"main;jkbvllhblbDJKCBjlb"}
                  initial={{ opacity: 0, x: -100 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    type: "tween",
                  }}
                  className="text-xl text-red-500 md:text-2xl italic px-5"
                >
                  RockGaan
                </motion.div>
              </Link>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex justify-center space-x-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={({ isActive }) =>
                        isActive
                          ? " bg-gray-700 text-white opacity-80 rounded-md px-3 py-2 text-sm font-medium"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={userSvg}
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute  right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <NavLink
                      to="/tickets"
                      // className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                      className={({ isActive }) =>
                        isActive
                          ? " block px-4 py-2 text-sm text-white data-[focus]:bg-gray-100 bg-slate-500"
                          : "block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                      }
                    >
                      My Tickets
                    </NavLink>
                  </MenuItem>
                  <MenuItem>
                    {localStorage.getItem("auth") ? (
                      <NavLink
                        to="/signout"
                        className={({ isActive }) =>
                          isActive
                            ? " block px-4 py-2 text-sm text-white data-[focus]:bg-gray-100 bg-slate-500"
                            : "block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        }
                      >
                        Sign Out
                      </NavLink>
                    ) : (
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          isActive
                            ? " block px-4 py-2 text-sm text-white data-[focus]:bg-gray-100 bg-slate-500"
                            : "block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        }
                      >
                        Login
                      </NavLink>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </HideNav>
  );
};

export default Navbar;
