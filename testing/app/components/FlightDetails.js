"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import logo from "../../public/logo2.png";

const FlightDetails = ({ searchFormData, details, setDetails, flight }) => {
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
          {searchFormData.fromOrigin.address.cityName} to{" "}
          {searchFormData.toOrigin.address.cityName},{" "}
          {new Date(flight.itineraries[0].segments[0].departure.at)
            .toUTCString()
            .slice(0, 17)}
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
              src={logo}
              height={80}
              alt="flight-logo"
            />
            <div className="flex flex-col">
              <div className="text-lg">
                <span className="font-bold">{flight.airlineName}</span>{" "}
                {flight.itineraries[0].segments[0].carrierCode} |{" "}
                {flight.itineraries[0].segments[0].aircraft.code}
              </div>
              <div className="">
                Aircraft : {flight.itineraries[0].segments[0].aircraft.code}
              </div>
              <div className="">
                Operated by : {flight.itineraries[0].segments[0].carrierCode}
              </div>
              <div className="">
                Cabin :{" "}
                {flight.travelerPricings[0].fareDetailsBySegment[0].cabin} (
                {flight.travelerPricings[0].fareDetailsBySegment[0].class})
              </div>
              <div className="">
                Available seats: {flight.numberOfBookableSeats}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3 p-8 ml-14 text-sky-950">
            <div>
              <div className="text-lg">
                {new Date(
                  flight.itineraries[0].segments[0].departure.at
                ).toLocaleTimeString()}{" "}
                <span className="text-sm">(local)</span>
              </div>
              <div className="text-sm">
                {new Date(flight.itineraries[0].segments[0].departure.at)
                  .toUTCString()
                  .slice(0, 17)}
              </div>
              <div className="">
                ({flight.itineraries[0].segments[0].departure.iataCode})
              </div>
              <div className="text-sm">
                Terminal -{" "}
                {flight.itineraries[0].segments[0].departure.terminal}
              </div>
              <div className="text-sm">{searchFormData.fromOrigin.name}</div>
              <div className="text-xs pt-2">
                {searchFormData.fromOrigin.address.cityName},
                {searchFormData.fromOrigin.address.countryName}
              </div>
            </div>
            <div>
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
              <div className="text-5xl ">
                <MdOutlineArrowRightAlt />
              </div>
            </div>
            <div>
              <div className="text-lg">
                {new Date(
                  flight.itineraries[0].segments[0].arrival.at
                ).toLocaleTimeString()}{" "}
                <span className="text-sm">(local)</span>
              </div>
              <div className="text-sm">
                {new Date(flight.itineraries[0].segments[0].arrival.at)
                  .toUTCString()
                  .slice(0, 17)}
              </div>
              <div className="">
                ({flight.itineraries[0].segments[0].arrival.iataCode})
              </div>
              <div className="text-sm">
                Terminal - {flight.itineraries[0].segments[0].arrival.terminal}
              </div>
              <div className="text-sm">Patenga</div>
              <div className="text-xs pt-2">
                {" "}
                {searchFormData.toOrigin.address.cityName},
                {searchFormData.toOrigin.address.countryName}
              </div>
            </div>
            <div className="">
              <div className="font-semi-bold text-xl">Baggage</div>
              <div className="text-sm">Adult</div>
            </div>
            <div className="">
              <div className="font-semi-bold text-xl">Check In </div>
              <div className="text-sm">
                {
                  flight.travelerPricings[0].fareDetailsBySegment[0]
                    .amenities[0].description
                }
              </div>
            </div>
            <div className="">
              <div className="font-semi-bold text-xl">Cabin</div>
              <div className="text-sm">15 lb(s)</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FlightDetails;
