const Left2 = () => {
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
    <div className="flex justify-center  items-center">
      <div className="relative border  mt-10 left2bg bg-gray-400 h-[589px] w-[390px] p-5">
        <div className="15 absolute z-10 top-[69%] left-[67%]">
          <svg
            width="32"
            height="35"
            viewBox="0 0 124 135"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              id="id15"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fillRule="evenodd"
              d="M107 113C89.5 100.5 43.8 65.7 1 26.5L68.5 1.5L107 47.5L118 79L123 132.5L107 113Z"
              stroke="black"
            />
          </svg>
        </div>
        <div className="14 absolute top-[70%] left-[62.5%]" id="14">
          <svg
            width="50"
            height="67"
            viewBox="0 0 207 226"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              id="id14"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fillRule="evenodd"
              d="M51.5 1L1.5 29L83 161L118 201.5L164.5 225L206.5 197.5V149L180.5 109L147 75L99.5 46L51.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div className="13 absolute top-[72%] left-[56%]" id="13">
          <svg
            width="59"
            height="67"
            viewBox="0 0 198 224"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              id="id13"
              onClick={handleClick}
              fillRule="evenodd"
              d="M81 178L101 206.5L141 223L190.5 206.5L197 165L164.5 127L123.5 81L86 21L46 1L1 32L54.5 111L72 142L81 178Z"
              stroke="black"
            />
          </svg>
        </div>
        <div className="4 absolute top-[10%] z-10 left-[30%]" id="4">
          <svg
            width="40"
            height="240"
            viewBox="0 0 172 884"
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
              fillRule="evenodd"
              d="M73.5 883H98L135.5 748V443.5V316.5L98 214V122.5L170.5 1H117L55 155L1 276V443.5L73.5 651V748V883Z"
              stroke="black"
            />
          </svg>
        </div>
        <div className="12 absolute top-[72%] left-[46%]" id="12">
          <svg
            width="58"
            height="65"
            viewBox="0 0 219 251"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              id="id12"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fillRule="evenodd"
              d="M57.5 150L4 44L46.5 12.5L117 0L164.5 107L202.5 150L215 216L164.5 242.5L87.5 224L57.5 150Z"
            />
          </svg>
        </div>
        <div className="6 absolute top-[25%] left-[37%]" id="6">
          <svg
            width="100"
            height="55"
            viewBox="0 0 369 232"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              id="id6"
              onClick={handleClick}
              fillRule="evenodd"
              d="M330 230.5L1 198L25 1.5L367.5 77L330 230.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div className="7 absolute top-[35%] z-10 left-[37%]" id="7">
          <svg
            width="110"
            height="144"
            viewBox="0 0 460 605"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              id="id7"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fillRule="evenodd"
              d="M26.5 348.5L50 1H142L361.5 20.5L381.5 87.5V199L399.5 330.5L459 568.5L246.5 604.5H142V503.5H1L26.5 417V348.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div className="11 absolute top-[72%] left-[28.5%]" id="11">
          <svg
            width="73"
            height="69"
            viewBox="0 0 265 242"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              id="id11"
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fillRule="evenodd"
              d="M264 196L253 204L213.5 232L168.5 241.5H126L84.5 232L49.5 219L27.5 196L22 159.5L27.5 117L34.5 92.5L27.5 72.5L11.5 52L1 32L49.5 1L213.5 11.5L207.5 62.5L218 92.5L239 122.5L264 168V196Z"
              stroke="black"
            />
          </svg>
        </div>
        <div className="9 absolute top-[55%] left-[29.8%]" id="9">
          <svg
            width="55"
            height="108"
            viewBox="0 0 242 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              id="id9"
              fillRule="evenodd"
              d="M225.5 0.5H52.5L32.5 132L0.5 285L11 359L72.5 328.5L225.5 339L241.5 258L225.5 98V0.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div className="10 absolute top-[58%] left-[43%]" id="10">
          <svg
            width="107"
            height="76"
            viewBox="0 0 392 283"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              id="id10"
              fillRule="evenodd"
              d="M30 212L1.5 37.5L68 53.5L149 37.5L325.5 1.5V147.5L390.5 212L293 241L84 282.5H1.5L30 212Z"
              stroke="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Left2;
