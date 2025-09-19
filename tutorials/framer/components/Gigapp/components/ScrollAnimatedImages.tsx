import React from "react";

const ScrollAnimatedImages = () => {
  return (
    <div className="m-5 rounded-xl text-black p-20 bg-gray-400 h-[100vh]">
      <div className="text-5xl my-3">Your design needs: </div>
      <div className="text-5xl my-3">covered</div>
      <div className="text-xl my-3">
        Your marketing design success starts here - everything you need to stand
        out, covered.
      </div>
      <div className="flex gap-5">
        <div className="w-60 h-60 border-3 ">
          <img
            className="w-60 h-60 border-3 relative top-0"
            src="https://framerusercontent.com/images/pCTYQqNTGptGPVwm4XQcjvVJVYA.jpg"
            alt="1"
          />
        </div>
        <div className="w-60 h-60 border-3">
          <img
            className="w-60 h-60 border-3"
            src="https://framerusercontent.com/images/RFtM8rexwdQmv6rPx25in8tYVjc.jpg"
            alt="1"
          />
        </div>
        <div className="w-60 h-60 border-3">
          <img
            className="w-60 h-60 border-3"
            src="https://framerusercontent.com/images/X1bg7snSGmkNHOwDktMFzIghDI.jpg"
            alt="1"
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimatedImages;
