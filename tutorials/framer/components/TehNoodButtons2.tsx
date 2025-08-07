import React from "react";
// import "./StartCultButton.css";
import "./Day 25/styles2.css";

const StartCultButton = () => {
  return (
    <div className="button-wrapper">
      <div className="rotating-line left-line"></div>
      <button className="start-cult-button">
        <span className="neon-border"></span>
        start a cult
      </button>
      <div className="rotating-line right-line"></div>
    </div>
  );
};

export default StartCultButton;
