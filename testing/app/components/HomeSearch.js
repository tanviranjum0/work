"use client";
import { motion } from "framer-motion";
// import { FaLongArrowAltRight } from "react-icons/fa";
// import { FaLongArrowAltLeft } from "react-icons/fa";
const HomeSearch = ({ modify }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        type: "spring",
        stiffness: 50,
      }}
    >
      <div className="text-center mt-10 text-7xl opacity-70">
        It’s more than just a trip
      </div>
      <div className="w-[90%] border-2 mt-5 pb-3  bg-white rounded-2xl mx-auto">
        <div className="bg-gray-200 py-5 m-2 rounded-xl text-center">
          <span className=" bg-white px-5 py-3 rounded-2xl text-3xl">
            Flight Booking
          </span>
        </div>
        <div className="flex pt-3 pl-5 gap-2">
          {" "}
          <div className="flex items-center ">
            <input
              id="one"
              type="radio"
              value="One Way"
              name="default-radio"
              className="w-4 h-4 hidden focus:ring-blue-600 text-blue-600 bg-gray-100 border-gray-300  "
            />
            <label
              htmlFor="one"
              className="px-3 text-gray-900 text-xl font-medium opacity-70 "
            >
              One Way
            </label>

            <input
              id="two"
              type="radio"
              value="Round Trip"
              name="default-radio"
              className="w-4 h-4 hidden text-blue-600 bg-gray-100 border-gray-300"
            />
            <label
              htmlFor="two"
              className="px-3  text-xl opacity-70  font-medium text-gray-900 "
            >
              Round Trip
            </label>
          </div>
        </div>
        <div className="grid grid-cols-5 mt-3 gap-3 mx-2">
          <div className="p-3 border rounded">
            <div className="text-sm opacity-80 ">From</div>
            <input type="text" className="text-xl" value={"Chittagong"} />
            <div className="text-sm opacity-80 ">Shahparam int airport</div>
          </div>
          <div className="p-3  border rounded">
            <div className="text-sm opacity-80 ">To</div>
            <input type="text" className="text-xl" value={"Chittagong"} />
            <div className="text-sm opacity-80 ">Shahparam int airport</div>
          </div>
          <div className="p-3 border">
            {" "}
            <div className="text-sm opacity-80 ">Departure</div>
            <input type="date" className="" value={"28 August 2022"} />
            <div className="text-sm opacity-80 ">Wednesday</div>
          </div>
          <div className="p-3 border">
            {" "}
            <div className="text-sm opacity-80 ">Return</div>
            <input type="date" className="" value={"30 August 2022"} />
            <div className="text-sm opacity-80 ">Thursday</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm opacity-80 ">Travelers & Booking Class</div>
            <div>1 Traveller</div>
            <div className="text-sm opacity-80 ">Economy</div>
          </div>
        </div>
        <div className=" mx-auto w-[80%] gap-5 pt-3 flex items-center justify-center">
          <div className="font-semibold"> Fare Type :</div>
          <div className="px-3 py-2 bg-sky-100 rounded-lg ">Regular</div>
          <div className="px-3 py-2 bg-sky-100 rounded-lg ">Business</div>
          <div className="px-3 py-2 bg-sky-100 rounded-lg ">Student</div>
        </div>
        <div className="w-[80%] mx-auto text-center flex justify-center items-center">
          <span className=" text-center px-7 rounded-lg py-3 text-xl select-none hover:bg-sky-700 hover:text-white transition-all duration-300 bg-sky-300 relative bottom-[-2rem]">
            {modify ? "Modify Search" : "Search"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeSearch;
