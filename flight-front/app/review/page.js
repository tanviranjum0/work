"use client";

import { IoIosWarning } from "react-icons/io";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ReviewForm from "../components/ReviewForm";
import ReviewDetails from "../components/ReviewDetails";

const page = () => {
  return (
    <div>
      <Navbar />
      <div>
        <div className="text-2xl p-2 my-3  md:p-5  text-sky-700 px-10 md:text-center">
          Review Your Booking
        </div>
        <ReviewDetails />
        <div className="text-2xl p-2 my-3  md:p-5  text-sky-700 px-10 md:text-center">
          Enter Traveller Details
        </div>
        <div>
          <div className="mx-auto w-[80vw] p-10">
            <div className="text-3xl py-5 text-slate-600">
              Personal Details (Adult)
            </div>
            <div className="text-sm text-sky-800 flex">
              <IoIosWarning className="h-5 mr-5 w-5" />
              As mentioned on your passport or government approved IDs
            </div>
            <ReviewForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
