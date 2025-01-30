import React from "react";
import logo from "../../public/logo.jpg";
import Image from "next/image";
const Footer = () => {
  return (
    <div className="text-white bg-zinc-900">
      <div className="w-[90vw] border-b-2 mx-auto p-10 grid grid-cols-4 gap-5 ">
        <div className="p-3">
          <div className="text-2xl font-semibold py-4">Platform</div>
          <li className="list-none">
            <ul className="py-1 hover:underline cursor-pointer">
              AutoLane Bike
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              AutoLane Car
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              AutoLane Food{" "}
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              AutoLane Shop{" "}
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              AutoLane Parcel
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              AutoLane Courier
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              AutoLane Rentals
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              AutoLane Maps
            </ul>
          </li>
        </div>
        <div className="p-3">
          <div className="text-2xl font-semibold py-4">Earn</div>
          <li className="list-none">
            <ul className="py-1 hover:underline cursor-pointer">
              Earn with Bike
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Earn with Car
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Earn with Cycle{" "}
            </ul>
          </li>
        </div>
        <div className="p-3">
          <div className="text-2xl font-semibold py-4">Marchant</div>
          <li className="list-none">
            <ul className="py-1 hover:underline cursor-pointer">
              Courier Marchant Sign Up
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Courier Marchant Login
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Car Admiral Login
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Resto Marchant Sign Up
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Resto Marchant Login
            </ul>
          </li>
        </div>
        <div className="p-3">
          {" "}
          <div className="text-2xl font-semibold py-4">Help</div>
          <li className="list-none">
            <ul className="py-1 hover:underline cursor-pointer">
              Walk in support center
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              User Help Center{" "}
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Rider Help Center
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Marchant Help Center{" "}
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Live Chat for Driver
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Helpline +1111 111 11
            </ul>
            <ul className="py-1 hover:underline cursor-pointer">
              Emergency helpline +12345
            </ul>
          </li>
        </div>
      </div>
      <div className="py-5  border-b-2 w-[80vw] mx-auto">
        <div className="flex justify-between">
          <div className=" hidden md:flex cursor-pointer items-center">
            {" "}
            <Image
              draggable="false"
              src={logo}
              className="border rounded-full"
              width={40}
              height={40}
              alt="logo"
            />
            <div className="text-2xl px-3">AutoLane</div>
          </div>
          <div className="px-3 justify-center gap-4 flex">
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
