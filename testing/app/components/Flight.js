"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import logo from "../../public/logo2.png";
import FlightDetails from "./FlightDetails";
import FareSummary from "./FareSummary";
import FareRules from "./FareRules";

const Flight = ({ flight, searchFormData }) => {
  // console.log(flight);
  const [details, setDetails] = useState("");
  const [airlineName, setAirlineName] = useState();
  useEffect(() => {
    const newFunc = async () => {
      const newData = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=${flight.validatingAirlineCodes[0]}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const flightresult = await newData.json();
      setAirlineName(flightresult.data[0]?.businessName);
    };
    newFunc();
  }, []);

  return (
    <div className="my-5">
      <div className="grid grid-cols-6 border py-5 rounded-lg bg-sky-100 ">
        <div className="p-1 pl-5">
          <Image
            src={logo}
            width={80}
            height={80}
            alt={logo}
            className="py-5"
          />
          <div className="text-sm">{airlineName}</div>
          <div className="text-green-600">Partially Refundable</div>
        </div>
        <div className="p-2 mt-10">
          <div className="text-sm"> Depart</div>
          <div className="pt-2 text-lg">
            {" "}
            {new Date(
              flight.itineraries[0].segments[0].departure.at
            ).toLocaleTimeString()}
          </div>
          <div className="">
            {new Date(flight.itineraries[0].segments[0].departure.at)
              .toUTCString()
              .slice(0, 17)}
          </div>
          <div className="text-sm my-auto">
            {searchFormData.fromOrigin.name}
          </div>
        </div>
        <div className="p-2 mt-10 flex items-center justify-center flex-col">
          <div className="text-sm">
            {Math.floor(
              (new Date(
                flight.itineraries[0].segments[0].arrival.at
              ).getTime() -
                new Date(
                  flight.itineraries[0].segments[0].departure.at
                ).getTime()) /
                60000 /
                60
            )}{" "}
            hours{" "}
            {((new Date(
              flight.itineraries[0].segments[0].arrival.at
            ).getTime() -
              new Date(
                flight.itineraries[0].segments[0].departure.at
              ).getTime()) /
              60000) %
              60}{" "}
            min
          </div>
          <div className="text-7xl ">
            <MdOutlineArrowRightAlt />
          </div>
          <div className="">Non Stop</div>
        </div>
        <div className="p-2 mt-10">
          <div className="text-sm"> Arrive</div>
          <div className="pt-2 text-lg">
            {new Date(
              flight.itineraries[0].segments[0].arrival.at
            ).toLocaleTimeString()}
          </div>
          <div className="">
            {new Date(flight.itineraries[0].segments[0].arrival.at)
              .toUTCString()
              .slice(0, 17)}
          </div>
          <div className="text-sm my-auto">{searchFormData.toOrigin.name}</div>
        </div>
        <div className="p-2 mt-10">
          <div className="text-sm ">Price</div>
          <div className="text-xl pt-5">
            {flight.price.currency} {flight.price.total}
          </div>
          <div className="text-sm pt-3">
            {flight.travelerPricings[0].fareDetailsBySegment[0].cabin} CLASS
          </div>
        </div>
        <div className="mt-5">
          <button className="mt-5 text-center bg-sky-300 hover:bg-sky-800 hover:text-sky-200 px-5 py-3 rounded-md transition-all duration-200 active:scale-95">
            Book Now!
          </button>
        </div>
      </div>
      <div className="absolute right-20 ">
        <div
          onClick={() => {
            if (details == "") setDetails("details");
            else {
              setDetails("");
            }
          }}
          className="relative bottom-10 hover:text-black cursor-pointer semi-bold text-sky-800"
        >
          Flight Details &#8595;
        </div>
      </div>
      {details == "details" && (
        <FlightDetails
          details={details}
          flight={flight}
          searchFormData={searchFormData}
          setDetails={setDetails}
        />
      )}
      {details == "fare" && (
        <FareSummary
          details={details}
          flight={flight}
          searchFormData={searchFormData}
          setDetails={setDetails}
        />
      )}
      {details == "rule" && (
        <FareRules
          details={details}
          searchFormData={searchFormData}
          flight={flight}
          setDetails={setDetails}
        />
      )}
    </div>
  );
};

export default Flight;
