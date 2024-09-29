"use client";
import { StoreContext } from "@/app/context/StoreContextMain";
import { useContext } from "react";

const SearchItem = ({ data, origin }) => {
  const { handleFromLocation, handleToSelect } = useContext(StoreContext);
  return (
    <div>
      <div
        onClick={() => {
          if (origin == "from") {
            handleFromLocation(data);
          } else if (origin == "to") {
            handleToSelect(data);
          }
        }}
        key={data.id}
        className=" w-full cursor-pointer transition-all duration-300 active:scale-95 hover:bg-sky-400/30 rounded  px-3 relative flex py-2"
      >
        <div className="flex flex-col">
          <div>{data?.address.cityName}</div>
          <div className="text-sm">
            {data?.name} Airport, {data?.address.countryName}
          </div>
        </div>
        <span className="absolute right-0 mr-4">{data?.iataCode}</span>
      </div>
    </div>
  );
};

export default SearchItem;
