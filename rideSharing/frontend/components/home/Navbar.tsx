// "use client";
import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import logo from "../../public/logo.jpg";
import { FiMessageCircle } from "react-icons/fi";
import { GiPathDistance } from "react-icons/gi";
import { PiMotorcycleFill } from "react-icons/pi";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="font-semibold h-20 select-none flex justify-center items-center bg-yellow-500">
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
          <span className="text-2xl hidden md:inline-block text-zinc-700 font-bold font-mono italic">
            AutoLane
          </span>
        </Link>
        <div className="flex">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs  ">
                Earn
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 size-5 text-gray-400"
                />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1 rounded-md bg-white">
                <MenuItem>
                  <div className="flex hover:bg-slate-200 hover:rounded-md cursor-pointer items-center text-sm mx-2">
                    <PiMotorcycleFill className="border text-2xl m-2 text-yellow-600" />
                    <div className="">
                      <div>Earn using MOTORCYCLE</div>
                      <div className="text-xs">Be a rider</div>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className="flex hover:bg-slate-200 hover:rounded-md cursor-pointer items-center text-sm mx-2">
                    <FaCar className="border text-2xl m-2 text-yellow-600" />
                    <div className="">
                      <div>Earn using CAR</div>
                      <div className="text-xs">Be a captain</div>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className="flex hover:bg-slate-200 hover:rounded-md cursor-pointer items-center text-sm mx-2">
                    <IoIosBicycle className="border text-2xl m-2 text-yellow-600" />
                    <div className="">
                      <div className="">Earn using BICYCLE</div>
                      <div className="text-xs">Be a cyclist</div>
                    </div>
                  </div>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs  ">
                Services
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 size-5 text-gray-400"
                />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1 rounded-md bg-white">
                <MenuItem>
                  <div className="flex hover:bg-slate-200 hover:rounded-md cursor-pointer items-center text-sm mx-2">
                    <PiMotorcycleFill className="border text-2xl m-2 text-yellow-600" />
                    <div className="">
                      <div>MOTORCYCLE</div>
                      <div className="text-xs">Save time in Traffic</div>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className="flex hover:bg-slate-200 hover:rounded-md cursor-pointer items-center text-sm mx-2">
                    <FaCar className="border text-2xl m-2 text-yellow-600" />
                    <div className="">
                      <div>CAR</div>
                      <div className="text-xs">Safe and Comfortable ride</div>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className="flex hover:bg-slate-200 hover:rounded-md cursor-pointer items-center text-sm mx-2">
                    <GiPathDistance className="border text-2xl m-2 text-yellow-600" />
                    <div className="">
                      <div className="">PARCEL</div>
                      <div className="text-xs">Emergency devivary</div>
                    </div>
                  </div>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs  ">
                Help
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 size-5 text-gray-400"
                />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1  rounded-md bg-white">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    User help center
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Rider/Captain help center
                  </a>
                </MenuItem>

                <MenuItem>
                  <a
                    href="#"
                    className="block border-t-2 px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    <div className="flex gap-2 items-center">
                      <FiMessageCircle />
                      <span>Message Support</span>
                    </div>
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block border-t-2 px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    <div className="flex gap-2 items-center">
                      <FaPhoneAlt />
                      <span>Helpline +1 1111 1111 11</span>
                    </div>
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs  ">
                Blog
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 size-5 text-gray-400"
                />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1  rounded-md bg-white">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Edit
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Duplicate
                  </a>
                </MenuItem>

                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Archive
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Move
                  </a>
                </MenuItem>

                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Share
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Add to favorites
                  </a>
                </MenuItem>

                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Delete
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
