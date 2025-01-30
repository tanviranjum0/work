import React from "react";
import Navbar from "./Navbar";
import Body1 from "./Body1";
import Body2 from "./Body2";
import Body3 from "./Body3";
import Body4 from "./Body4";
import DownloadSection from "./DownloadSection";
import Body5 from "./Body5";
import Footer from "./Footer";
const Main = () => {
  return (
    <div className="">
      <div className=" mt-20 main-bg">
        {/* <Navbar /> */}
        <Body1 />
      </div>
      <div className="mt-[100vh]">
        <Body2 />
      </div>
      <div className="py-16 bg-yellow-50">
        <Body3 />
      </div>
      <Body4 />
      <div className="my-12">
        <DownloadSection />
      </div>
      <Body5 />
      {/* <div className="">
        <Footer />
      </div> */}
    </div>
  );
};

export default Main;
