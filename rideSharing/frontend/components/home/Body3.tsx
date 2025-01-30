import React from "react";

const Body3 = () => {
  return (
    <div>
      <div className="w-[80vw] md:w-[75vw] mx-auto grid grid-cols-1 md:grid-cols-2">
        <div>
          <div className="text-xl md:text-3xl font-semibold py-4">
            The Safest Platform
          </div>
          <div>
            We care about your safety. And to ensure it, we’ve introduced safety
            coverage for all of our users, rides & captains. Your safety is our
            first priority.
          </div>
          <div className="text-lg text-red-600">Learn more</div>
        </div>
        <div>
          <div className="text-xl md:text-3xl font-semibold py-4">
            We Care About You
          </div>
          <div>
            We believe in providing safety and support. Pathao is the only
            platform with a rapid response team, call centre support, safety
            coverage, live location share, and more! #HereWithYou every step of
            the way.
          </div>
          <div className="text-lg text-red-600">Read More </div>
        </div>
      </div>
      <div className="flex w-[75vw] mt-8 md:mt-10 mx-auto justify-center">
        <div>
          <div className="text-2xl font-semibold md:text-6xl">
            Earn with your car, bike or bicycle
          </div>
          <div className="text-center md:text-lg py-2 md:py-4">
            Become a captain, rider or foodman on the highest earning platform!
          </div>
          <div className="md:px-6 px-4 mx-auto flex items-center gap-2 mt-4 py-2 font-medium text-2xl md:text-3xl z-10 bg-yellow-300 text-black w-fit cursor-pointer transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95">
            Start Earning
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body3;
