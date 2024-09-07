"use client";
import Image from "next/image";
import logo from "../../public/logo2.png";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { RiTwitterXFill } from "react-icons/ri";
const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="mb-10 opacity-10"
    >
      <div className="grid mb-10 pl-10 mt-10 w-[90vw] mx-auto gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="text-sky-800">
          <div className="flex scale-75 pb-5">
            {" "}
            <div className="h-10 ">
              <Image
                src={logo}
                width={100}
                height={100}
                alt="Picture of the author"
              />
            </div>
            <div className="text-xl  italic ml-[-8px]">MoveSeeks</div>
          </div>
          <div className="text-sm">
            MoveSeeks is the country’s first and leading online travel
            aggregator (OTA). Since our inception, we have dreamt of making
            travel easier for people of all ages and we move forward to make
            that dream into reality.
          </div>
        </div>
        <div>
          <div className="text-lg pt-5 border-b-2">Contact Us</div>
          <ul className="list-none pt-5 text-sm">
            <li>Email : moveseeks@official.com</li>
            <li>Tel : +01 11111111111</li>
            <li>
              {" "}
              Whatsapp : <span className="text-blue-500">Message Us</span>
            </li>
            <li className="flex gap-5 mt-3">
              <FaFacebook className="scale-125 hover:text-sky-700" />
              <FaSquareInstagram className="scale-125 hover:text-sky-700" />
              <RiTwitterXFill className="scale-125 hover:text-sky-700" />
              <FaLinkedin className="scale-125 hover:text-sky-700" />
            </li>
          </ul>
        </div>
        <div>
          <div className="text-lg pt-5 border-b-2">Useful Links</div>
          <ul className="list-none text-sm pt-5">
            <li>Travel Guide</li>
            <li>Travel Advisory</li>
            <li> Visa Application</li>
            <li>Visa Guide</li>
          </ul>
        </div>
        <div>
          <div className="text-lg pt-5 border-b-2">We Accept</div>
          <div className="flex">
            <div>
              <svg
                fill="#000000"
                width="50px"
                height="50px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.539 9.186a4.155 4.155 0 0 0-1.451-.251c-1.6 0-2.73.806-2.738 1.963-.01.85.803 1.329 1.418 1.613.631.292.842.476.84.737-.004.397-.504.577-.969.577-.639 0-.988-.089-1.525-.312l-.199-.093-.227 1.332c.389.162 1.09.301 1.814.313 1.701 0 2.813-.801 2.826-2.032.014-.679-.426-1.192-1.352-1.616-.563-.275-.912-.459-.912-.738 0-.247.299-.511.924-.511a2.95 2.95 0 0 1 1.213.229l.15.067.227-1.287-.039.009zm4.152-.143h-1.25c-.389 0-.682.107-.852.493l-2.404 5.446h1.701l.34-.893 2.076.002c.049.209.199.891.199.891h1.5l-1.31-5.939zm-10.642-.05h1.621l-1.014 5.942H9.037l1.012-5.944v.002zm-4.115 3.275.168.825 1.584-4.05h1.717l-2.551 5.931H5.139l-1.4-5.022a.339.339 0 0 0-.149-.199 6.948 6.948 0 0 0-1.592-.589l.022-.125h2.609c.354.014.639.125.734.503l.57 2.729v-.003zm12.757.606.646-1.662c-.008.018.133-.343.215-.566l.111.513.375 1.714H18.69v.001h.001z" />
              </svg>
            </div>
            <div>
              <svg
                width="50px"
                height="50px"
                viewBox="0 -9 58 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <rect
                    x="0.5"
                    y="0.5"
                    width="57"
                    height="39"
                    rx="3.5"
                    fill="white"
                    stroke="#F3F3F3"
                  />{" "}
                  <path
                    d="M34.3102 28.9765H23.9591V10.5122H34.3102V28.9765Z"
                    fill="#0d0d0c"
                  />{" "}
                  <path
                    d="M24.6223 19.7429C24.6223 15.9973 26.3891 12.6608 29.1406 10.5107C27.1285 8.93843 24.5892 7.99998 21.8294 7.99998C15.2961 7.99998 10 13.2574 10 19.7429C10 26.2283 15.2961 31.4857 21.8294 31.4857C24.5892 31.4857 27.1285 30.5473 29.1406 28.975C26.3891 26.8249 24.6223 23.4884 24.6223 19.7429"
                    fill="#0a0a0a"
                  />{" "}
                  <path
                    d="M48.2706 19.7429C48.2706 26.2283 42.9745 31.4857 36.4412 31.4857C33.6814 31.4857 31.1421 30.5473 29.1293 28.975C31.8815 26.8249 33.6483 23.4884 33.6483 19.7429C33.6483 15.9973 31.8815 12.6608 29.1293 10.5107C31.1421 8.93843 33.6814 7.99998 36.4412 7.99998C42.9745 7.99998 48.2706 13.2574 48.2706 19.7429"
                    fill="#050505"
                  />{" "}
                </g>
              </svg>
            </div>
            <div>
              <svg
                fill="#000000"
                height="50px"
                width="50px"
                version="1.1"
                id="Layer_1"
                viewBox="0 0 330 330"
              >
                <g id="XMLID_16_">
                  <polygon
                    id="XMLID_17_"
                    points="86.608,170.361 92.148,170.361 89.39,161.174 	"
                  />
                  <path
                    id="XMLID_18_"
                    d="M315,42.857H15c-8.284,0-15,6.716-15,15v214.285c0,8.284,6.716,15,15,15h300c8.284,0,15-6.716,15-15V57.857
		C330,49.573,323.284,42.857,315,42.857z M103.431,193.662c-2.539,0-4.688-1.521-5.473-3.875c-0.013-0.04-0.025-0.081-0.038-0.121
		l-2.233-7.48h-12.63l-2.216,7.42c-0.663,2.431-2.896,4.056-5.596,4.056c-3.15,0-6.55-2.247-6.55-5.879c0-0.294,0-0.995,0.289-1.79
		l13.98-45.422c0.832-2.66,3.358-4.367,6.44-4.367c3.068,0,5.612,1.679,6.479,4.277l13.988,45.661
		c0.059,0.189,0.103,0.383,0.132,0.579c0.059,0.268,0.111,0.598,0.111,0.995C110.115,191.273,106.659,193.662,103.431,193.662z
		 M161.25,187.917c0,3.275-2.672,5.745-6.215,5.745c-3.485,0-6.215-2.523-6.215-5.745v-21.59l-3.604,6.816
		c-1.202,2.254-3.149,3.54-5.349,3.54c-1.269,0-3.64-0.458-5.274-3.529l-3.543-6.806v21.569c0,3.221-2.729,5.745-6.215,5.745
		c-3.543,0-6.214-2.47-6.214-5.745v-45.164c0-3.562,2.613-6.147,6.214-6.147c4.381,0,6.432,3.945,7.106,5.242l7.994,15.43
		l7.991-15.425c1.811-3.483,4.201-5.247,7.108-5.247c3.659,0,6.215,2.528,6.215,6.147V187.917z M202.412,159.154
		c3.184,0,5.678,2.641,5.678,6.013c0,3.314-2.44,5.812-5.678,5.812h-6.536v10.589h17.475c3.184,0,5.678,2.671,5.678,6.08
		c0,3.428-2.44,6.013-5.678,6.013H189.46c-3.372,0-6.013-2.523-6.013-5.745v-45.634c0-3.237,2.585-5.678,6.013-5.678h23.891
		c3.237,0,5.678,2.556,5.678,5.946c0,3.504-2.44,6.148-5.678,6.148h-17.475v10.455H202.412z M254.688,193.796
		c-3.48,0-5.007-3.054-5.659-4.358l-6.354-12.02l-6.396,12.1c-0.61,1.224-2.138,4.278-5.617,4.278c-3.13,0-6.617-2.552-6.617-6.215
		c0-0.995,0.226-1.931,0.69-2.861c0.019-0.038,0.037-0.075,0.058-0.111l10.524-19.52l-10.31-19.338
		c-0.595-1.061-0.895-2.183-0.895-3.334c0-3.335,2.906-5.946,6.617-5.946c3.467,0,5.102,3.069,5.801,4.38l6.145,11.734l6.119-11.688
		c0.728-1.363,2.362-4.426,5.826-4.426c3.711,0,6.617,2.612,6.617,5.946c0,1.15-0.302,2.273-0.897,3.337l-10.369,19.335
		l10.582,19.511c0.021,0.04,0.042,0.08,0.062,0.12c0.465,0.93,0.69,1.866,0.69,2.861
		C261.305,191.244,257.817,193.796,254.688,193.796z"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div className="text-sm block">
            Sat-Thurs: 9AM-9PM Friday/Govt. Holidays: 10AM-6PM
          </div>
        </div>
      </div>
      <hr />
      <div className="col-span-12 text-center py-8 text-gray-600">
        Copyright @2024 Roksana. All rights reserved by MoveSeeks
      </div>
    </motion.div>
  );
};

export default Footer;
