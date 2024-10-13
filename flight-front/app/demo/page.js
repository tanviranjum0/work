// "use client";
// import { useEffect } from "react";
// const page = () => {
//   const handleClick = async () => {
//     console.log(localStorage.getItem("access_token"));
//     const lala = await fetch(
//       "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=DXB&destinationLocationCode=BKK&departureDate=2024-11-11&adults=1&max=2",
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           // Authorization: `Bearer CpjU0sEenniHCgPDrndzOSWFk5mN`,
//         },
//       }
//     );
//     const lulu = await lala.json();
//     console.log(lulu);
//   };
//   useEffect(() => {
//     async function kaka() {
//       const data = fetch(
//         "https://test.api.amadeus.com/v1/security/oauth2/token",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: "grant_type=client_credentials&client_id=2bwVwkjGtQ26gZ69vG9ji3b7xdgo4Y1L&client_secret=H5BPU8XvnXbKuMD6",
//         }
//       );

//       const result = await data;
//       // console.log(result);
//       const main = await result.json();
//       // console.log(main);
//       // console.log(main.access_token);
//       localStorage.setItem("access_token", main.access_token);
//     }
//     kaka();
//   }, []);

//   return (
//     <div
//       onClick={() => handleClick()}
//       className="flex p-4 border cursor-pointer bg-sky-200 justify-center items-center text-5xl"
//     >
//       Demo
//     </div>
//   );
// };

// export default page;

// "use client";
// import { motion } from "framer-motion";
// import { FaSearch } from "react-icons/fa";
// // import Image from "next/image";
// import { HiMiniXMark } from "react-icons/hi2";
// // import img from "../images/turkish-logo.jpg";
// import { useState } from "react";

// const SearchQuery = () => {
//   const [error, setError] = useState("");
//   const [searchData, setSearchData] = useState();
//   // let searchInput;
//   const handleSearchChange = () => {
//     setError(null);
//     let searchInput = document.getElementById("searchInput").value;
//     async function lallala() {
//       const lala = await fetch(
//         `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${searchInput}&page[limit]=5`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         }
//       );
//       const lulu = await lala.json();
//       // console.log(lulu.data);
//       if (lulu.data[0] == undefined) {
//         setError("No search results found");
//         setSearchData([]);
//         return;
//       }
//       setSearchData(lulu.data);
//     }
//     lallala();
//   };
//   return (
//     <div id="baggageDetails" className="absolute inset-0 backdrop-blur">
//       {" "}
//       <motion.div
//         key={"nothingmuch"}
//         initial={{
//           scale: 0.8,
//           opacity: 0,
//           skewX: 5,
//         }}
//         whileInView={{
//           scale: 1,
//           opacity: 1,
//           skewX: 0,
//         }}
//         transition={{
//           duration: 0.1,
//           type: "spring",
//           stiffness: 50,
//         }}
//         className="flex justify-center h-screen w-screen inset-0 items-center"
//       >
//         <div className="w-[90vw]  py-5 bg-sky-50 md:w-[40vw] shadow-2xl">
//           <div className="relative ">
//             <HiMiniXMark
//               onClick={() => handleDetails()}
//               className="absolute top-0 right-0 mr-3 cursor-pointer text-3xl"
//             />
//           </div>
//           <div className="relative">
//             <div className="absolute top-2 right-20 mr-3 cursor-pointer ">
//               <FaSearch
//                 onClick={(e) => {
//                   e.preventDefault();
//                   handleSearchChange();
//                 }}
//                 className="text-2xl"
//               />
//             </div>
//           </div>
//           <input
//             id="searchInput"
//             placeholder="Search Airport..."
//             className="text-lg py-3 mb-3 px-4 mx-4 w-[80%] focus:outline-none  focus:border-b-2 bg-inherit border-b-2 "
//           />

//           <div className="w-[95%] mx-auto  my-3">
//             {error ? error : null}
//             {!searchData || !searchData.data == [] ? (
//               <div className=" w-full hover:bg-sky-400/30 rounded  px-3 relative flex py-2">
//                 <div className="text-sm">No Data , Search </div>
//               </div>
//             ) : (
//               searchData.map((data) => {
//                 if (data.subType == "AIRPORT") {
//                   return (
//                     <div
//                       key={data.id}
//                       className=" w-full cursor-pointer transition-all duration-300 active:scale-95 hover:bg-sky-400/30 rounded  px-3 relative flex py-2"
//                     >
//                       <div className="flex flex-col">
//                         <div>{data.address.cityName}</div>
//                         <div className="text-sm">
//                           {data.name} Airport, {data.address.countryName}
//                         </div>
//                       </div>
//                       <span className="absolute right-0 mr-4">
//                         {data.iataCode}
//                       </span>
//                     </div>
//                   );
//                 }
//               })
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default SearchQuery;

// "use client";
// import { useEffect } from "react";
// const page = () => {
//   const handleClick = async () => {
//     console.log(localStorage.getItem("access_token"));
//     const lala = await fetch(
//       "https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=mi&page[limit]=5",
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           // Authorization: `Bearer CpjU0sEenniHCgPDrndzOSWFk5mN`,
//         },
//       }
//     );
//     const lulu = await lala.json();
//     console.log(lulu);
//   };

//   return (
//     <div
//       onClick={() => handleClick()}
//       className="flex p-4 border cursor-pointer bg-sky-200 justify-center items-center text-5xl"
//     >
//       Demo two
//     </div>
//   );
// };

// export default page;
"use client";
import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
const START_FROM = new Date();
START_FROM.setMonth(START_FROM.getMonth() + 1);
const MIN_DATE = new Date();
MIN_DATE.setDate(MIN_DATE.getDate() - 4);
const App = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  console.log(value.startDate?.toISOString().slice(0, 10));
  console.log(value);
  return (
    <div className="flex justify-center items-center">
      <input
        type="date"
        onChange={(e) => {
          console.log(e.target.value);
        }}
        id="testingDate"
      />
      <div className="w-[10%] h-[10vw]">
        <Datepicker
          inputClassName="w-full bg-sky-400 h-24"
          useRange={false}
          minDate={MIN_DATE}
          startFrom={START_FROM}
          value={value}
          asSingle={true}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
    </div>
  );
};

export default App;
