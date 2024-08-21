import React from "react";

const left4 = () => {
  const handleMouseEnter = (e) => {
    // console.log(e.target);
    e.target.classList.add("opacity-20");
    e.target.setAttribute("stroke", "black");
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove("opacity-20");
    e.target.setAttribute("stroke", "none");
  };
  const handleClick = async (e) => {
    // console.log(e.target.classList);
    e.target.classList.add("opacity-35");
    if (e.target.getAttribute("fill") == "white") {
      await e.target.setAttribute("fill", "yellow");
    } else if (e.target.getAttribute("fill") == "yellow") {
      await e.target.setAttribute("fill", "#DC4D01");
    } else if (e.target.getAttribute("fill") == "#DC4D01") {
      await e.target.setAttribute("fill", "red");
    } else if (e.target.getAttribute("fill") == "red") {
      await e.target.setAttribute("fill", "white");
      e.target.classList.remove("opacity-35");
    }
  };
  // #f0e229 = Yellow
  // #f7900a = Orange
  // #c4240c = Red
  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="relative border left4bg mt-10 left2bg bg-gray-400 h-[589px] w-[390px] p-5">
          <div id="1" className="1 absolute top-[49%] left-[33%] z-10">
            <svg
              width="124"
              height="73"
              viewBox="0 0 155 91"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="opacity-0"
                id="id1"
                fill="white"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M1.5 32.5L30.5 1H79L132 3L139.5 18L154 52L145 74L125 88L83.5 90.5L46 84L5 59L1.5 32.5Z"
                stroke="black"
              />
            </svg>
          </div>
          <div id="2" className="2 absolute z-10 top-[36%] left-[41%]">
            <svg
              width="80"
              height="72"
              viewBox="0 0 99 89"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="opacity-0"
                fill="white"
                id="id2"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M7 57.5L25.5 1L51 6H88.5L86 30.5L88.5 57.5L98 88.5H75H35L1 85L7 57.5Z"
                stroke="black"
              />
            </svg>
          </div>
          <div id="3" className="3 absolute top-[12%] left-[46%]">
            <svg
              width="70"
              height="140"
              viewBox="0 0 87 176"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="opacity-0"
                fill="white"
                id="id3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M1.5 175.5L5.5 0.5H85.5L76.5 65.5L63 175.5H1.5Z"
                stroke="black"
              />
            </svg>
          </div>
          <div id="18" className="18 absolute top-[0.5%] left-[59%]">
            <svg
              width="43"
              height="340"
              viewBox="0 0 57 426"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="opacity-0"
                id="id18"
                fill="white"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M24.7255 390L32.2745 425L56 331V286V225.5L50.0686 194.5L42.5196 130.5L45.7549 92L55.4608 1H40.902L25.8039 92L6.93137 231L1 278.5V324.5L11.7843 368L24.7255 390Z"
                stroke="black"
              />
            </svg>
          </div>
          <div id="4" className="4 absolute top-[0.5%] left-[35%]">
            <svg
              width="44"
              height="303"
              viewBox="0 0 60 404"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="opacity-0"
                fill="white"
                onMouseEnter={handleMouseEnter}
                id="id4"
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M27.5 0.5H15.5V100.5V173.5L5.5 235.5V282.5L15.5 312L5.5 357.5L1 403L27.5 363.5L42 332.5L59.5 235.5V91.5L27.5 0.5Z"
                stroke="black"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default left4;
