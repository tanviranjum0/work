const Right5 = () => {
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
      await e.target.setAttribute("fill", "orange");
    } else if (e.target.getAttribute("fill") == "orange") {
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
    <div className="flex justify-center items-center">
      <div className="relative -scale-x-100 border mt-10 left5bg bg-gray-400 h-[589px] w-[390px] p-5">
        <div id="21" className="21 absolute top-[59%] left-[20%]">
          <svg
            width="104"
            height="61"
            viewBox="0 0 123 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M6.5 5.99996L1 35.5L42 71.5H116V56C115.2 46 119.667 26.8333 122 18.5C109.833 18.1667 77.9 15.2 47.5 5.99996C17.1 -3.20004 7.5 2.16663 6.5 5.99996Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="22" className="22 absolute top-[60%] z-10 left-[47%]">
          <svg
            width="45"
            height="61"
            viewBox="0 0 53 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M1 61.5L8.5 15.5L26.5 0.5H43L52 9L34.5 57.5L8.5 70.5L1 61.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="23" className="23 absolute top-[38%] z-10 left-[35%]">
          <svg
            width="92"
            height="143"
            viewBox="0 0 108 168"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M25.5 12L32.5 1.5L59 12H79L103.5 1.5L98 53.5V93.5L106.5 141.5L76 147.5L59 162L35.5 166.5L6.5 157L1 117.5L6.5 90L25.5 12Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="24" className="24 absolute top-[28%] left-[22%]">
          <svg
            width="85"
            height="187"
            viewBox="0 0 100 216"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M4.5 155L1.5 206.5L36 214.5L64 206.5V181L80 111.5L98.5 58.5L87 1L64 6L25 88L4.5 155Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="1" className="1 absolute top-[16%] left-[41%]">
          <svg
            width="110"
            height="133"
            viewBox="0 0 129 157"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M1 100.5V71.5L25.5 31.5L55.5 3.5L97 1L117 12.5L127 44.5L128.5 62.5L122 92L109.5 114L89 133.5L64 151.5L34 155.5L12.5 146L1 100.5Z"
              stroke="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Right5;
