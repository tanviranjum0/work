"use client";
// import { motion } from "framer-motion";
import FromOriginInput from "./FromOriginInput";
import ToOriginInput from "./ToOriginInput";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContextMain";
import Datepicker from "react-tailwindcss-datepicker";
const START_FROM = new Date();
START_FROM.setMonth(START_FROM.getMonth() + 1);
const MIN_DATE = new Date();
MIN_DATE.setDate(MIN_DATE.getDate() + 1);

const HomeSearch = ({ modify }) => {
  // console.log(document.querySelector("input[name=rate]:checked"));
  const {
    setSearchData,
    dates,
    cabinType,
    setCabinType,
    setDates,
    returnTrue,
    setReturnTrue,
    flightDepartureDates,
    setFlightDepartureDates,
    flightReturnDates,
    setflightReturnDates,
    setQuery,
    query,
    searchFormData,
    handleFlightSearch,
    days,
  } = useContext(StoreContext);

  return (
    <div>
      <div className="home-search-animation">
        <FromOriginInput />
        <ToOriginInput />
        <div className="text-center mt-10 text-7xl opacity-70">
          It’s more than just a trip
        </div>
        <div className="w-[90%] border-2 shadow-2xl mt-5 pb-3 bg-white rounded-2xl mx-auto">
          <div className="bg-gray-200 py-5 m-2 rounded-xl text-center">
            <span className=" bg-white px-5 py-3 rounded-2xl text-3xl">
              Flight Booking
            </span>
          </div>
          <div className="flex pt-3 pl-5 gap-2">
            <div className="flex items-center ">
              <div
                onClick={() => setReturnTrue(false)}
                className={`w-4 h-4 rounded-full border-2 cursor-pointer text-sky-300 ${
                  returnTrue ? "bg-gray-100" : "bg-black"
                } border-gray-300`}
              ></div>
              <div
                onClick={() => setReturnTrue(false)}
                className="px-3 cursor-pointer text-gray-900 text-xl font-medium opacity-70 "
              >
                One Way
              </div>
              <div
                onClick={() => setReturnTrue(true)}
                className={`w-4 h-4 rounded-full border-2 cursor-pointer text-sky-300  ${
                  returnTrue ? "bg-black" : "bg-gray-100"
                } border-gray-300`}
              ></div>
              <div
                onClick={() => setReturnTrue(true)}
                className="px-3 cursor-pointer text-xl opacity-70 font-medium text-gray-900"
              >
                Round Trip
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 mt-3 gap-3 mx-2">
            <div
              onClick={() => {
                setSearchData([]);
                setQuery({
                  fromInput: true,
                  toInput: false,
                  departureDateInput: false,
                  returnDateInput: false,
                  travellersCount: false,
                });
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
                setQuery({
                  fromInput: false,
                  toInput: true,
                  departureDateInput: false,
                  travellersCount: false,
                  returnDateInput: false,
                });
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
            <div
              className={`p-3 cursor-pointer ${
                query.departureDateInput && "bg-sky-100"
              } border rounded`}
              onClick={() =>
                setQuery({
                  fromInput: false,
                  toInput: false,
                  departureDateInput: true,
                  travellersCount: false,
                  returnDateInput: false,
                })
              }
            >
              <div className="text-sm opacity-80 ">Departure</div>{" "}
              <Datepicker
                inputClassName={`w-full focus:outline-none active:border ${
                  query.departureDateInput && "bg-sky-100"
                }`}
                useRange={false}
                minDate={MIN_DATE}
                startFrom={START_FROM}
                value={flightDepartureDates}
                asSingle={true}
                onChange={(newValue) => {
                  setFlightDepartureDates(newValue);
                  let d = new Date(newValue.startDate);
                  let day = days[d.getDay()];
                  setDates({ ...dates, departureDay: day });
                }}
              />
              <div className="text-sm opacity-80 ">{dates.departureDay}</div>
            </div>
            <div
              className={`p-3 cursor-pointer  ${
                returnTrue ? "" : "bg-gray-200 cursor-not-allowed"
              } ${query.returnDateInput && "bg-sky-100"} border rounded`}
              onClick={() => {
                if (!returnTrue) {
                  return;
                }
                setQuery({
                  fromInput: false,
                  toInput: false,
                  departureDateInput: false,
                  travellersCount: false,
                  returnDateInput: true,
                });
              }}
            >
              <div className={`text-sm opacity-80`}>Return</div>

              <Datepicker
                disabled={!returnTrue}
                inputClassName={`w-full focus:outline-none active:border ${
                  query.returnDateInput && "bg-sky-100"
                }`}
                useRange={false}
                minDate={MIN_DATE}
                startFrom={START_FROM}
                classNames={` ${
                  returnTrue ? "" : "bg-gray-200 cursor-not-allowed"
                }`}
                value={flightReturnDates}
                asSingle={true}
                onChange={(newValue) => {
                  setflightReturnDates(newValue);
                  let d = new Date(newValue.startDate);
                  let day = days[d.getDay()];
                  setDates({ ...dates, returnDay: day });
                }}
              />
              <div className="text-sm opacity-80 ">{dates.returnDay}</div>
            </div>
            <div
              className={`p-3 cursor-pointer ${
                query.travellersCount && "bg-sky-100"
              } border rounded`}
              onClick={() =>
                setQuery({
                  fromInput: false,
                  toInput: false,
                  departureDateInput: false,
                  travellersCount: true,
                  returnDateInput: false,
                })
              }
            >
              <div className="text-sm opacity-80 ">
                Travelers & Booking Class
              </div>
              <input
                type="number"
                name="number"
                defaultValue={1}
                min={0}
                id="flightsearchadultnumber"
                className={`px-3 border-b-1 active:border focus:border-b-2 focus:outline-none rounded-md w-full ${
                  query.travellersCount && "bg-sky-100"
                }`}
              />
              <div className="text-sm opacity-80 ">Economy</div>
            </div>
          </div>
          <div className=" mx-auto w-[80%] gap-5 pt-3 flex items-center justify-center">
            <div className="font-semibold"> Fare Type :</div>
            <div
              onClick={() => setCabinType("ECONOMY")}
              className={`px-3 py-2 border hover:bg-sky-300 cursor-pointer rounded-lg ${
                cabinType == "ECONOMY" ? "bg-sky-200" : ""
              }`}
            >
              Economy
            </div>
            <div
              onClick={() => setCabinType("PREMIUM_ECONOMY")}
              className={`px-3 py-2 border hover:bg-sky-300 cursor-pointer rounded-lg ${
                cabinType == "PREMIUM_ECONOMY" ? "bg-sky-200" : ""
              }`}
            >
              Premium
            </div>
            <div
              onClick={() => setCabinType("BUSINESS")}
              className={`px-3 py-2 border hover:bg-sky-300 cursor-pointer rounded-lg ${
                cabinType == "BUSINESS" ? "bg-sky-200" : ""
              }`}
            >
              Business
            </div>
            <div
              onClick={() => setCabinType("FIRST")}
              className={`px-3 py-2 border hover:bg-sky-300 cursor-pointer rounded-lg ${
                cabinType == "FIRST" ? "bg-sky-200" : ""
              }`}
            >
              First
            </div>
          </div>
          <div className="w-[80%] mx-auto text-center flex justify-center items-center">
            <span
              onClick={(e) => handleFlightSearch(e)}
              className="active:scale-90  text-center px-7 cursor-pointer rounded-lg py-3 text-xl select-none hover:bg-sky-700 hover:text-white transition-all duration-300 bg-sky-300 relative bottom-[-2rem]"
            >
              {modify ? "Modify Search" : "Search"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSearch;
