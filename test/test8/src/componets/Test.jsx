import React from "react";
// import Tappable from "react-tappable/lib/Tappable";
// import Pinchable from "react-tappable/lib/Pinchable";
// import TapAndPinchable from "react-tappable/lib/TapAndPinchable";
import svg from "./assets/IMG_0266.png";
import "./App.css";
const Test = () => {
  const handleTapEvent = () => {
    console.log("TTested");
  };
  const handlePinch = () => {
    console.log("pinched");
  };

  const handleRect = (e) => {
    console.log(e, "Rectangle clicked");
  };

  const handleNew = (e) => {
    if (e.target.getAttribute("fill") === "violet") {
      e.target.setAttribute("fill", "yellow");
    } else if (e.target.getAttribute("fill") === "yellow") {
      e.target.setAttribute("fill", "orange");
    } else if (e.target.getAttribute("fill") === "orange") {
      e.target.setAttribute("fill", "red");
    } else if (e.target.getAttribute("fill") === "red") {
      e.target.setAttribute("fill", "violet");
    }
    console.log(e.target.id, "Colour Changed");
  };
  const handleCircle = (e) => {
    console.log(e.target.id, "Circle clicked");
  };
  const handlePoly = (e) => {
    e.target.setAttribute("stroke", "red");
    console.log(e.target, "Poly clicked");
  };

  return (
    // <div>
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="text-4xl">Hola</div>
      {/* <Tappable onTap={handleTapEvent}>Tap me</Tappable>
        <Pinchable onPinch={handlePinch}> Pinch events</Pinchable>
        <TapAndPinchable onTap={handleTapEvent} onPinch={handlePinch}>
          pinch
        </TapAndPinchable>
      </div>
      <img
        src={svg}
        alt="YourImage"
        useMap="#YourMap"
        height={500}
        onClick={handleRect}
        // className="border w-full h-full  border-red-500"
        style={{ background: `transparent`, border: "1px solid black" }}
      /> */}
      {/* //The useMap attribute must match the name attribute of your map. */}
      {/* <map name="YourMap">
        <area
          style={{ "border""1px solid black" }}
          onClick={handleRect}
          shape="rect"
          coords="0,0,82,126"
          alt="Path1"
        />
        //Coords are x, y of the top left corner and the bottom right corner of
        the rectangle
        <area
          onClick={handleCircle}
          shape="circle"
          coords="90,58,3"
          alt="Path2"
        />
        //Coords are the x, y of the center of the circle and the lenght of half
        the diameter of the circle
        <area
          onClick={handlePoly}
          shape="poly"
          coords="124,58,8, 1"
          alt="Path3"
        />
        //Coords are the x, y of each points in the shape drew for an pentagone
        (5 corners) //The coords attribute could look like this coords="0, 0,
        10, 10, 5, 10, 10, 5, 12, 13" //I know this dont make a pentagone but it
        does ilustrate that you need 5 pairs of //numbre in the coords and that
        if you need more of them you can add however you need .
      </map> */}
      <svg height="400" width="450" xmlns="http://www.w3.org/2000/svg">
        <path
          id="lineAB"
          d="M 100 350 l 150 -300"
          stroke="red"
          strokeWidth="4"
        />
        <path id="lineBC" d="M 250 50 l 150 300" stroke="red" strokeWidth="4" />
        <path
          id="lineMID"
          d="M 175 200 l 150 0"
          stroke="green"
          strokeWidth="4"
        />
        <path
          id="lineAC"
          d="M 100 350 q 150 -300 300 0"
          stroke="blue"
          fill="none"
          onClick={handlePoly}
          strokeWidth="4"
        />
        <g stroke="black" strokeWidth="3" fill="black">
          <circle onClick={handleCircle} id="pointA" cx="100" cy="350" r="4" />
          <circle onClick={handleCircle} id="pointB" cx="250" cy="50" r="4" />
          <circle onClick={handleCircle} id="pointC" cx="400" cy="350" r="4" />
        </g>
        <g
          fontSize="30"
          fontFamily="sans-serif"
          fill="green"
          textAnchor="middle"
        >
          <text onClick={handlePoly} x="100" y="350" dx="-30">
            A
          </text>
          <text onClick={handlePoly} x="250" y="50" dy="-10">
            B
          </text>
          <text onClick={handlePoly} x="400" y="350" dx="30">
            C
          </text>
        </g>
        Sorry, your browser does not support inline SVG.
      </svg>
      <svg
        style={{ position: "absolute", right: "50px" }}
        height="100"
        width="100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          id="spot"
          onClick={handleNew}
          r="45"
          cx="50"
          cy="50"
          fill="violet"
        />
      </svg>
    </div>
  );
};

export default Test;
