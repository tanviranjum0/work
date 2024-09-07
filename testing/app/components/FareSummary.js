"use client";
import { motion } from "framer-motion";

const FareSummary = ({ details, setDetails }) => {
  return (
    <div class="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
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
        class="w-full text-sm text-left rtl:text-right text-gray-500 "
      >
        <thead class="text-xs text-gray-800 uppercase bg-gray-200  ">
          <tr>
            <th scope="col" class="px-6 py-3">
              Fare Summary
            </th>
            <th scope="col" class="px-6 py-3">
              Base Fare
            </th>
            <th scope="col" class="px-6 py-3">
              Taxes + Fees
            </th>
            <th scope="col" class="px-6 py-3">
              Per Passenger
            </th>
            <th scope="col" class="px-6 py-3">
              <span class="sr-only">Total</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white text-sky-800 border-b  hover:bg-gray-50 ">
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Adult
            </th>
            <td class="px-6 py-4">BDT 3.277</td>
            <td class="px-6 py-4">BDT 989</td>
            <td class="px-6 py-4">BDT (4.266x1)</td>
            <td class="px-6 py-4 text-right">BDT 4.266</td>
          </tr>
          <tr class="bg-white border-b  hover:bg-gray-50">
            <th
              colSpan={3}
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Total Traveller : 01
            </th>

            <td colSpan={2} class="px-6 py-4 text-sky-800  text-right">
              Total : BDT 4.277
            </td>
          </tr>
        </tbody>
      </motion.table>
    </div>
  );
};

export default FareSummary;
