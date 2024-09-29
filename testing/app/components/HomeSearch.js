"use client";
import { motion } from "framer-motion";
import FromOriginInput from "./FromOriginInput";
import ToOriginInput from "./ToOriginInput";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContextMain";

const HomeSearch = ({ modify }) => {
  const {
    setSearchData,
    dates,
    setDates,
    setQuery,
    query,
    searchFormData,
    handleFlightSearch,
    days,
  } = useContext(StoreContext);

  return (
    <div>
      <motion.div
        key={"mainhomesearch"}
        initial={{ opacity: 0.3, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          type: "spring",
        }}
      >
        <FromOriginInput />
        <ToOriginInput />
        <div className="text-center mt-10 text-7xl opacity-70">
          It’s more than just a trip
        </div>
        <div className="w-[90%] border-2 mt-5 pb-3 bg-white rounded-2xl mx-auto">
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
                defaultValue="One Way"
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
                defaultValue="Round Trip"
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
            <div
              onClick={() => {
                setSearchData([]);
                setQuery({ fromInput: true, toInput: false });
                document
                  .getElementById("searchFormFromOrigin")
                  .classList.toggle("hidden");
                document.getElementById("searchInputFromOrigin").focus();
              }}
              className={`p-3 cursor-pointer ${
                query.fromInput && "bg-sky-100"
              } border rounded`}
            >
              <div className="text-sm opacity-80 ">From</div>
              <div type="text" className="text-sm w-full">
                {searchFormData?.fromOrigin.name}
              </div>

              <div className="text-xs opacity-80 ">
                {searchFormData?.fromOrigin.address.cityName},
                <span className="text-xs">
                  {searchFormData?.toOrigin.address.countryName}
                </span>
              </div>
            </div>
            <div
              onClick={() => {
                setSearchData([]);
                setQuery({ fromInput: false, toInput: true });
                document
                  .getElementById("searchFormToOrigin")
                  .classList.toggle("hidden");
                document.getElementById("searchInputToOrigin").focus();
              }}
              className={`p-3 cursor-pointer ${
                query.toInput && "bg-sky-100"
              } border rounded`}
            >
              <div className="text-sm opacity-80 ">To</div>

              <div type="text" className="text-sm  w-full">
                {searchFormData?.toOrigin.name}
              </div>
              <div className="text-xs opacity-80 ">
                {searchFormData?.toOrigin.address.cityName},
                <span className="text-xs">
                  {searchFormData?.toOrigin.address.countryName}
                </span>
              </div>
            </div>
            <div className="p-3 border">
              {" "}
              <div className="text-sm opacity-80 ">Departure</div>
              <input
                type="date"
                className=""
                id="flightsearchdeparturedate"
                onChange={(e) => {
                  let d = new Date(e.target.value);
                  let day = days[d.getDay()];
                  setDates({ ...dates, departureDay: day });
                }}
              />
              <div className="text-sm opacity-80 ">{dates.departureDay}</div>
            </div>
            <div className="p-3 border">
              <div className="text-sm opacity-80 ">Return</div>
              <input
                type="date"
                className=""
                id="flightsearchreturndate"
                onChange={(e) => {
                  let d = new Date(e.target.value);
                  let day = days[d.getDay()];
                  setDates({ ...dates, returnDay: day });
                }}
              />
              <div className="text-sm opacity-80 ">{dates.returnDay}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-sm opacity-80 ">
                Travelers & Booking Class
              </div>
              <input
                type="number"
                name="number"
                defaultValue={1}
                id="flightsearchadultnumber"
                className="px-3 border-b-1 focus:border-b-2 focus:outline-none rounded-md w-full"
              />
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
            <span
              onClick={(e) => handleFlightSearch(e)}
              className="active:scale-90  text-center px-7 rounded-lg py-3 text-xl select-none hover:bg-sky-700 hover:text-white transition-all duration-300 bg-sky-300 relative bottom-[-2rem]"
            >
              {modify ? "Modify Search" : "Search"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeSearch;
