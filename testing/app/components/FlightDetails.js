"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import img from "../images/turkish-logo.jpg";
const FlightDetails = ({ details, setDetails }) => {
  return (
    <div>
      <div className="p-5 shadow-md">
        <div className="flex my-3 justify-center items-center cursor-pointer ">
          <div
            onClick={() => setDetails("details")}
            className={`px-3 py-2 border rounded shadow-lg ${
              details === "details" ? "bg-sky-800 text-white" : ""
            }`}
          >
            Flight Details
          </div>
          <div
            onClick={() => setDetails("fare")}
            className={`px-3 py-2 border rounded shadow-lg ${
              details === "fare" ? "bg-sky-800 text-white" : ""
            }`}
          >
            Fare Summary
          </div>

          <div
            onClick={() => setDetails("rule")}
            className={`px-3 py-2 border rounded shadow-lg ${
              details === "rule" ? "bg-sky-800 text-white" : ""
            }`}
          >
            Fare Rules
          </div>
        </div>
        <div className="border bg-sky-50  text-lg px-3 py-1">
          Dhaka to Chittagong, 10 Sep 2024
        </div>
        <motion.div
          initial={{
            y: -100,
          }}
          animate={{
            y: 0,
          }}
          transition={{
            duration: 0.2,
            type: "tween",
          }}
          className="border bg-sky-50"
        >
          <div className="flex px-14 py-5">
            <Image
              className="py-5 mx-5"
              src={img}
              height={80}
              width={80}
              alt="flight-logo"
            />
            <div className="flex flex-col">
              <div className="text-lg">
                <span className="font-bold">Biman Bangladesh Airlines</span> BG
                | 147
              </div>
              <div className="">Aircraft : Boeing 787-8</div>
              <div className="">Operated by : BG</div>
              <div className="">Economy (G)</div>
              <div className="">Available seats: 9</div>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3 p-8 ml-14 text-sky-950">
            <div>
              <div className="text-lg">20:00</div>
              <div className="text-sm">Tue, 10 Sep 2024</div>
              <div className="">(DAC)</div>
              <div className="text-sm">Terminal -</div>
              <div className="text-sm">Hazrat Shahjalal Int...</div>
              <div className="text-sm">Dhaka,Bangladesh</div>
            </div>
            <div>
              <div className="text-sm">45 min</div>
              <div className="text-5xl ">
                <MdOutlineArrowRightAlt />
              </div>
            </div>
            <div>
              <div className="text-lg">20:45</div>
              <div className="text-sm">Tue, 10 Sep 2024</div>
              <div className="">(CGP)</div>
              <div className="text-sm">Terminal -</div>
              <div className="text-sm">Patenga</div>
              <div className="text-sm">Chattogram,Bangladesh</div>
            </div>
            <div className="">
              <div className="font-semi-bold text-xl">Baggage</div>
              <div className="text-sm">Adult</div>
            </div>
            <div className="">
              <div className="font-semi-bold text-xl">Check In </div>
              <div className="text-sm">20 kg(s)</div>
            </div>
            <div className="">
              <div className="font-semi-bold text-xl">Cabin</div>
              <div className="text-sm">7 kg(s)</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FlightDetails;
