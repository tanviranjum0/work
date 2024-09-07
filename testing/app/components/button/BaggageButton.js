"use client";
import BaggageDetails from "../BaggageDetails";
import { handleDetails } from "../BaggageDetails";

const BaggageButton = () => {
  return (
    <div>
      <BaggageDetails />
      <button
        onClick={() => handleDetails()}
        className="bg-sky-800 rounded-lg py-2 px-2 transiton-all duration-200 hover:bg-sky-200 hover:text-sky-900 text-white"
      >
        View Baggage
      </button>
    </div>
  );
};
export default BaggageButton;
