"use client";
import { motion } from "framer-motion";
const FareSummary = ({ details, setDetails, flight, searchFormData }) => {
  return (
    <div className="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
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
      <motion.table
        key={"mainfaresummarymotion"}
        initial={{
          y: -100,
        }}
        animate={{
          y: 0,
        }}
        transition={{
          duraion: 1,
          type: "tween",
        }}
        className="w-full text-sm text-left rtl:text-right text-gray-500 "
      >
        <thead className="text-xs text-gray-800 uppercase bg-gray-200  ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Fare Summary
            </th>
            <th scope="col" className="px-6 py-3">
              Base Fare
            </th>
            <th scope="col" className="px-6 py-3">
              Taxes + Fees
            </th>
            <th scope="col" className="px-6 py-3">
              Per Passenger
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Total</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white text-sky-800 border-b  hover:bg-gray-50 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Adult
            </th>
            <td className="px-6 py-4">
              {flight.price.currency} {flight.price.base}
            </td>
            <td className="px-6 py-4">
              {flight.price.currency}{" "}
              {Math.round(flight.price.total - flight.price.base)}
            </td>
            <td className="px-6 py-4">
              {flight.price.currency} ({flight.price.total}x1)
            </td>
            <td className="px-6 py-4 text-right">
              {" "}
              {flight.price.currency} {flight.price.total}
            </td>
          </tr>
          <tr className="bg-white border-b  hover:bg-gray-50">
            <th
              colSpan={3}
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Total Traveller : 01
            </th>

            <td colSpan={2} className="px-6 py-4 text-sky-800  text-right">
              Total : {flight.price.currency} {flight.price.total}
            </td>
          </tr>
        </tbody>
      </motion.table>
    </div>
  );
};

export default FareSummary;
