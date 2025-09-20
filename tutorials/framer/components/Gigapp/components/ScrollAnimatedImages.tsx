import React from "react";

const ScrollAnimatedImages = () => {
  return (
    <div className="rounded-xl text-black p-20 bg-gray-400 w-full h-[100vh]">
      <div className="text-5xl col-span-12 my-3">Your design needs: </div>
      <div className="text-5xl col-span-12 my-3">covered</div>
      <div className="text-xl col-span-12 my-3">
        Your marketing design success starts here - everything you need to stand
        out, covered.
      </div>
      <div className="flex">
        <img
          className="w-60 h-60 border-3 rotate-6 relative left-[30rem] -top-64"
          src="https://framerusercontent.com/images/pCTYQqNTGptGPVwm4XQcjvVJVYA.jpg"
          alt="1"
        />
        <img
          className="w-60 h-60 border-3 rotate-6 relative left-[28rem] -top-64"
          src="https://framerusercontent.com/images/RFtM8rexwdQmv6rPx25in8tYVjc.jpg"
          alt="2"
        />
        <img
          className="w-60 h-60 border-3 rotate-6 relative left-[26rem] -top-64"
          src="https://framerusercontent.com/images/X1bg7snSGmkNHOwDktMFzIghDI.jpg"
          alt="3"
        />
      </div>
    </div>
  );
};

export default ScrollAnimatedImages;
