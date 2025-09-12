import React from "react";
import "./Gigapp.css";
import Navbar from "./components/Navbar";
import MarqueeComponent from "./components/MarqueeComponent";

const Gigapp = () => {
  return (
    <div className="bg-[#003631] overflow-x-hidden h-screen w-screen  text-white">
      <Navbar />
      <MarqueeComponent />
    </div>
  );
};

export default Gigapp;
