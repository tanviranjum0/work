"use client";
import Flight from "./Flight";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContextMain";

const Flights = () => {
  const { searchFormData, availableFlights } = useContext(StoreContext);
  const flights = availableFlights?.data;
  return (
    <div className="w-[90vw] mt-10 mx-auto">
      <div className="text-center text-2xl pt-10 md:pt-0 md:text-4xl">
        Flights From {searchFormData.fromOrigin.name} To{" "}
        {searchFormData.toOrigin.name}
      </div>
      <div className="flex gap-10 w-[90vw] mt-5">
        <div className="rounded-lg border w-full hover:bg-slate-200 transition-all duration-200 text-center p-2 md:p-4">
          <div className="md:text-2xl font-bold">Cheapest</div>
          <div className="">To get available cheapest flights</div>
        </div>

        <div className="rounded-lg border w-full hover:bg-slate-200 transition-all duration-200 text-center p-2 md:p-4">
          <div className="md:text-2xl font-bold">Shortest</div>
          <div className="">To get available shortest flights</div>
        </div>
      </div>
      {flights ? (
        availableFlights.data.map((flight, idx) => {
          return (
            <Flight
              key={`${idx}flightindividual`}
              flight={flight}
              searchFormData={searchFormData}
            />
          );
        })
      ) : (
        <div className="flex justify-center items-center py-10 px-20 mt-5 bg-sky-100">
          <div className="text-center text-2xl">No available flights</div>
        </div>
      )}
    </div>
  );
};

export default Flights;
