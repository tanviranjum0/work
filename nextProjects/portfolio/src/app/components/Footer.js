"use client";
import Form from "./Form";
import { FaFacebook } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="shadow mx-auto">
      <div className="bg-[#B9F0F2] dark:bg-[#17223B] dark:text-[#C4D7F6]">
        <div className="grid md:grid-cols-2 gap-1  justify-around">
          <div className="p-14  ">
            <div className="text-3xl">Connect With Me!</div>
            <p>
              I&apos;m currently looking for new opportunities, my inbox is
              always open. Whether you have a question or just want to say hi,
              I&apos;ll try my best to get back to you!
            </p>
            <div className="flex gap-2  icons">
              <div className="text-2xl">
                {" "}
                <FaLinkedin />
              </div>
              <div className="text-2xl">
                <FaFacebook />
              </div>
              <div className="text-2xl">
                <FiInstagram />
              </div>
            </div>
          </div>
          <div className=" p-3">
            <Form />
          </div>
        </div>
        <footer className="text-center py-8">
          All rights reserved || Copyright@2024
        </footer>
      </div>
    </div>
  );
};

export default Footer;
