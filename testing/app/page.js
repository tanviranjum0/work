import React from "react";
import Navbar from "./components/Navbar";
import HomeSearch from "./components/HomeSearch";
import HomeCarousel from "./components/HomeCarousel";
import Footer from "./components/Footer";
import ActiveAirlines from "./components/ActiveAirlines";

const page = () => {
  return (
    <div className="flex flex-col">
      <div className="h-[95vh] pb-10 main-bg text-sky-800">
        {" "}
        <Navbar />
        <HomeSearch modify={false} />
      </div>
      <HomeCarousel />
      <ActiveAirlines />
      <Footer />
    </div>
  );
};

export default page;
