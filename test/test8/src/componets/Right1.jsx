const Right1 = () => {
  const handleMouseEnter = (e) => {
    e.target.classList.add("opacity-20");
    e.target.setAttribute("stroke", "black");
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove("opacity-20");
    e.target.setAttribute("stroke", "none");
  };
  const handleClick = async (e) => {
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
      <div className="relative border -scale-x-100 mt-10 foot3bg bg-gray-400 h-[589px] w-[390px] p-5">
        <div
          id="one"
          className="1 inline-block absolute z-20 top-[34%] left-[3.5%]"
        >
          <svg
            width="110"
            height="90"
            viewBox="0 0 233 182"
            // viewBox="0 0 127 99"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M142.5 26.5L231.5 181.5H201.5L160.5 171.5L80.5 133L33.5 97L7 62.5L1 31.5L38.5 26.5L92.5 1L142.5 26.5Z"

              // stroke=""
            />
          </svg>
        </div>

        <div id="two" className="2 absolute z-10 top-[24.2%] left-[3%]">
          <svg
            width="45"
            height="76"
            viewBox="0 0 89 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fillRule="evenodd"
              clipRule="evenodd"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="white"
              d="M35 139.5H1V106.5L15.5 79.5L48.5 40.5L88.5 2V79.5L64.5 126L35 139.5Z"

              // stroke=""
            />
          </svg>
        </div>
        <div id="three" className="3 absolute z-10 top-0 left-[14%]">
          <svg
            width="68"
            height="214"
            viewBox="0 0 123 393"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14 342.5L1 377.5H29.5L56.5 391.5V327.5L106.5 117L121.5 1H96.5L82.5 91L37 227.5L14 252.5V316.5V342.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="white"
              // stroke=""
            />
          </svg>
        </div>
        <div id="four" className="4 absolute z-10 top-0 left-[24%]">
          <svg
            width="130"
            height="355"
            viewBox="0 0 240 662"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M239 650L223.5 660.5L198 631H158.5L136.5 626L107 588L87 544L29.5 455.5L1 344L53.5 1H117.5V112L115.5 170L117.5 216L122.5 313L126 344L144.5 394.5L158.5 443L167 455.5L206 531.5L226.5 600L239 650Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="white"
              // stroke=""
            />
          </svg>
        </div>
        <div id="five" className="5 absolute z-20 top-1 left-[40%]">
          <svg
            width="49"
            height="170"
            viewBox="0 0 72 277"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.5 57.5L7 1H70.5L67 30.5L58 113.5L56 181L58 236L20.5 276L7 259.5L1 146.5V107.5L4.5 57.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="white"
              // stroke=""
            />
          </svg>
        </div>
        <div id="six" className="6 absolute z-20 top-1 left-[50.5%] ">
          <svg
            width="67"
            height="142"
            viewBox="0 0 122 259"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M94 257.5L120.5 1H14L1 251L94 257.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="white"
              // stroke=""
            />
          </svg>
        </div>
        <div id="seven" className="7 absolute z-10 top-[8%] left-[43%]">
          <svg
            width="107"
            height="399"
            viewBox="0 0 197 399"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M196 398L110 396L87.5 323L57 236.5L25 176L1 111.5L15 104.5L60.5 47V1L150 8L161 141.5L175 188V227L181 271.5L192 337.5L196 398Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="white"
              // stroke=""
            />
          </svg>
        </div>
        <div id="eight" className="8 absolute z-10 top-[57%] left-[44%]">
          <svg
            width="109"
            height="136"
            viewBox="0 0 201 249"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M193.5 226L191 247.5L145 244L113.5 238.5L89.5 228.5L70 215.5L54 181L41 150.5L32 119L1 1L70 6.5L99.5 52.5L113.5 102.5L145 133.5L170.5 153.5L199.5 167L196.5 201.5L193.5 226Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="white"
              // stroke=""
            />
          </svg>
        </div>
        <div id="nine" className="9 absolute z-20 top-[60%] left-[56.5%]">
          <svg
            width="83"
            height="80"
            viewBox="0 0 153 146"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.5 69.5L17.5 39L1 10L22.5 1L52.5 4.5L67 32.5L114.5 117.5L127.5 126.5L150.5 136L114.5 145L78 126.5L49.5 99.5L22.5 69.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="white"
              // stroke=""
            />
          </svg>
        </div>
        <div id="ten" className="10 absolute z-20 top-[60%] left-[64.5%]">
          <svg
            width="60"
            height="64"
            viewBox="0 0 107 113"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M33.5 62L1 1H54.5L62 47.5L75 70L105.5 94.5L92 112.5H67L54.5 100.5L33.5 62Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="white"
              // stroke=""
            />
          </svg>
        </div>
        <div id="eleven" className="11 absolute z-10 top-[71%] left-[71%]">
          <svg
            width="86"
            height="64"
            viewBox="0 0 187 116"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M134 116H119H89.5L68.5 113.5L47 108.5L25.5 101.5L0 86L7.5 12.5L53 0L64.5 5L75.5 12.5L89.5 18L100.5 22L111.5 25L121 28L130.5 32L138.5 35L145.5 37L153.5 40L161 43L165.5 44.5L169 46L172.5 48L176 50L180.5 52.5L184 55L186.5 57.5V64.5V75.5V81L184 86L180.5 93L173.5 101.5L165.5 108.5L155.5 113.5L145.5 116H134Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="white"
              // stroke=""
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Right1;
