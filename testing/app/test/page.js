"use client";

import { useEffect, useState } from "react";

const page = () => {
  // AviationStack Api Key = fced63bc4f138c0c6f4c760bf45c1b6c
  const [data, setData] = useState("");
  useEffect(() => {
    const url =
      "https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?sourceAirportCode=BOM&destinationAirportCode=DEL&itineraryType=ONE_WAY&sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&classOfService=ECONOMY&pageNumber=1&nearby=yes&nonstop=yes&currencyCode=USD&region=USA";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "1c17dd9e7dmsh623ee7a1c29650bp1fd31cjsn3caffe55b7b3",
        "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
      },
    };
    async function tryingg() {
      try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
        setData(result);
      } catch (error) {
        console.error(error);
      }
    }
    tryingg();
  }, []);
  return (
    <div>
      <div className="p-10">{data}</div>
    </div>
  );
};

export default page;
