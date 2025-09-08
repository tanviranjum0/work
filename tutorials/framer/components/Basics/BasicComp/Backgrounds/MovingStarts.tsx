import React from "react";
import "./movingStars.css";
const MovingStarts = () => {
  return (
    <div>
      <div className="h-screen w-screen bg-blue-400">
        <div className="stars"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
      </div>
    </div>
  );
};

export default MovingStarts;
