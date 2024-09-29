"use client";
import { createContext, useState } from "react";
import { useRouter } from "next/navigation";
export const StoreContext = createContext(null);
const StoreContextMain = ({ children }) => {
  const router = useRouter();
  const [searchFormData, setSearchFormData] = useState({
    fromOrigin: {
      name: "Search your location...",
      address: {
        cityName: "City",
        countryName: "Country",
      },
    },
    toOrigin: {
      name: "Search your destination...",
      address: {
        cityName: "City",
        countryName: "Country",
      },
    },
  });

  const [fromSearchLoader, setFromSearchLoader] = useState(false);
  const [availableFlights, setAvailableFlights] = useState();
  const [searchToLoader, setSearchToLoader] = useState(false);
  const [dates, setDates] = useState({
    departureDay: "",
    returnDay: "",
  });

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [error, setError] = useState("");
  const [searchData, setSearchData] = useState();
  const [query, setQuery] = useState({
    fromInput: false,
    toInput: false,
  });

  const handleDetails = () => {
    const baggage = document.getElementById("baggageDetails");
    baggage.classList.toggle("hidden");
  };

  const handleFlightSearch = async (e) => {
    e.preventDefault();
    router.push("/search");
    setAvailableFlights();
    const departureDate = document.getElementById(
      "flightsearchdeparturedate"
    ).value;
    // const returnDate = document.getElementById("flightsearchreturndate").value;
    const adultnumber = document.getElementById(
      "flightsearchadultnumber"
    ).value;

    let url = new URLSearchParams();

    url.set("originLocationCode", searchFormData.fromOrigin.iataCode);
    url.set("destinationLocationCode", searchFormData.toOrigin.iataCode);
    url.set("departureDate", departureDate);
    url.set("adults", adultnumber);
    url.set("max", 10);

    const data = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${url}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    const result = await data.json();
    setAvailableFlights(result);
  };

  const handleSearchChangeToOrigin = () => {
    setSearchToLoader(true);
    setSearchData([]);
    setError("");
    let searchInput = document.getElementById("searchInputToOrigin").value;
    async function lallala() {
      const lala = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${searchInput}&page[limit]=5`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const lulu = await lala.json();

      if (lulu.data[0] == undefined) {
        setSearchToLoader(false);
        setError("No search results found");
        setSearchData([]);
        return;
      }

      setSearchData(lulu.data);
      setSearchToLoader(false);
    }
    lallala();
  };

  const handleSearchChangeFromOrigin = () => {
    setFromSearchLoader(true);
    setSearchData([]);
    setError("");
    let searchInput = document.getElementById("searchInputFromOrigin").value;
    async function lallala() {
      const lala = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${searchInput}&page[limit]=5`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const lulu = await lala.json();
      if (lulu.data == undefined) {
        setError("No search results found");
        setSearchData([]);
        setFromSearchLoader(false);
        return;
      }
      setSearchData(lulu.data);
      setFromSearchLoader(false);
    }
    lallala();
  };

  const handleFromLocation = (data) => {
    setSearchFormData({
      ...searchFormData,
      fromOrigin: data,
    });
    document.getElementById("searchFormFromOrigin").classList.toggle("hidden");
    setQuery({
      fromInput: true,
      toInput: false,
    });
  };

  const handleToSelect = (data) => {
    setSearchFormData({
      ...searchFormData,
      toOrigin: data,
    });
    document.getElementById("searchFormToOrigin").classList.toggle("hidden");
    setQuery({
      fromInput: false,
      toInput: true,
    });
  };

  const contextValue = {
    handleToSelect,
    handleSearchChangeFromOrigin,
    handleFromLocation,
    handleFlightSearch,
    searchData,
    setSearchData,
    searchFormData,
    setSearchFormData,
    handleSearchChangeToOrigin,
    fromSearchLoader,
    setFromSearchLoader,
    query,
    setQuery,
    error,
    days,
    availableFlights,
    setAvailableFlights,
    setError,
    handleDetails,
    searchToLoader,
    setSearchToLoader,
    dates,
    setDates,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
export default StoreContextMain;
