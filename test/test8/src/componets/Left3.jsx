import React, { useContext, useEffect } from "react";
import { StoreContext } from "../context/StoreContextMain";

const Left3 = () => {
  const { zone, increasePain } = useContext(StoreContext);
  const handleMouseEnter = (e) => {
    // console.log(e.target);
    e.target.classList.add("opacity-20");
    e.target.setAttribute("stroke", "black");
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove("opacity-20");
    e.target.setAttribute("stroke", "none");
  };
  useEffect(() => {
    const iterator = async () => {
      for (const id in zone) {
        if (zone[id] == 1) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.add("opacity-35");
            newPoint.setAttribute("fill", "yellow");
          });
        } else if (zone[id] == 2) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "orange");
          });
        } else if (zone[id] == 3) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "red");
          });
        } else if (zone[id] == 0) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "white");
            newPoint.classList.remove("opacity-35");
          });
        }
      }
    };
    iterator();
  }, [zone]);
  const handleClick = async (e) => {
    increasePain(e.target.getAttribute("id"));
    // e.target.classList.add("opacity-35");
    // if (zone[e.target.getAttribute("id")] == 0) {
    //   await increasePain(e.target.getAttribute("id"));
    //   await e.target.setAttribute("fill", "yellow");
    // } else if (zone[e.target.getAttribute("id")] == 1) {
    //   await increasePain(e.target.getAttribute("id"));
    //   await e.target.setAttribute("fill", "orange");
    // } else if (zone[e.target.getAttribute("id")] == 2) {
    //   await increasePain(e.target.getAttribute("id"));
    //   await e.target.setAttribute("fill", "red");
    // } else if (zone[e.target.getAttribute("id")] == 3) {
    //   await increasePain(e.target.getAttribute("id"));
    //   await e.target.setAttribute("fill", "white");
    //   e.target.classList.remove("opacity-35");
    // }
  };
  return (
    <div className="flex justify-center items-center">
      <div className="relative border -scale-x-100 right3bg mt-10 left2bg bg-gray-400 h-[589px] w-[390px] p-5">
        <div id="1" className="1 z-10 absolute top-[31.5%] left-[4.5%]">
          <svg
            width="80"
            height="92"
            viewBox="0 0 99 114"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              id="id1"
              clipRule="evenodd"
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M98 113V54.5L93.5 45L82 23.5L63 1.5L55 11.5L36 21L16 18.5L1 11.5L11 42.5L33 65.5L68 93.5L98 113Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="2" className="2 z-10 absolute top-[21%] left-[5%]">
          <svg
            width="69"
            height="80"
            viewBox="0 0 84 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="opacity-0"
              id="id2"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M25 99L1.5 89L14 54.5L39 28L67 1L82.5 46.5L48 94L25 99Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="3" className="3 z-10 absolute top-0 left-[18.5%]">
          <svg
            width="78"
            height="163"
            viewBox="0 0 106 207"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="opacity-0"
              id="id3"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M17.5 205.5L1 165.5L14.5 141.5L27 112L47 57L59.5 1H104.5L80 70L52 134.5L17.5 205.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="17" className="17 absolute top-[1.5%] left-[40%]">
          <svg
            width="47"
            height="180"
            viewBox="0 0 64 253"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="opacity-0"
              id="id17"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M1 214V251.5L26 218.5L50 177L58.5 138.5L63 101.5V49V0.5H50L44 20L26 74.5L6.5 150L1 214Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="18" className="18 absolute top-0 left-[18.5%]">
          <svg
            width="117"
            height="236"
            viewBox="0 0 160 326"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="opacity-0"
              fill="white"
              id="id18"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M21.5 219.5L1 251.5L21.5 274L35 305L58.5 324.5V309.5L63 287.5L71.5 268L88 257.5H110V224.5V201.5L115 168.5L125 117L142 56L159 1L110 5L97.5 38L71.5 112.5L41 174.5L21.5 219.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="6" className="6 absolute left-[60.5%] top-[21%]">
          <svg
            width="31"
            height="80"
            viewBox="0 0 39 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              id="id6"
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M24.5 0.5H5.5L1.5 1L2.5 11L5.5 54.5L12 99.5H38L24.5 69.5V0.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7" className="7 z-30 absolute top-[35%] left-[50%]">
          <svg
            width="85"
            height="167"
            viewBox="0 0 114 225"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              id="id7"
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M69 1L1 48L34 109.5L53 154.5L78 196L108.5 223.5L113.5 185L108.5 142L98.5 1H69Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="19" className="19 z-10 absolute top-[32%] left-[28.5%]">
          <svg
            width="124"
            height="138"
            viewBox="0 0 155 171"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="opacity-0"
              id="id19"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M0.5 40.5V65L47 91.5L77 113L97 134.5L115 168L154 170L137 132.5L116.5 91.5L95 56.5L52 1H25L8.5 15.5L0.5 40.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="20" className="20 z-30 absolute top-[56%] left-[54%]">
          <svg
            width="60"
            height="82"
            viewBox="0 0 102 136"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="opacity-0"
              id="id20"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M44 1H1.5L20 48.5L33.5 84.5L56 105L88.5 134.5L99.5 107L101 71L66.5 38.5L44 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="21" className="21 absolute z-20 top-[41%] left-[28.5%]">
          <svg
            width="167"
            height="195"
            viewBox="0 0 231 268"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              id="id21"
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M0.5 2V56.5L23.5 68.5L54 79.5L80.5 101L107 124L114 158L126.5 196L148 227L173 244.5L202 261.5L228.5 266.5L170 213.5L156 176.5L133.5 113.5L110.5 79.5L77.5 52.5L36.5 29.5L0.5 2Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="11" className="11 absolute top-[59.6%] left-[72.5%]">
          <svg
            width="80"
            height="31"
            viewBox="0 0 99 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              id="id11"
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M0.5 14.5V1H15L28 5L41.5 9L52.5 13H61H71.5H83L89.5 18C90.5 18.1667 93.3 20.6 96.5 29C99.7 37.4 95.1667 37.8333 92.5 37L54.5 31.5L31 24L0.5 14.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="12" className="12 absolute top-[61.5%] left-[72.5%]">
          <svg
            width="94"
            height="33"
            viewBox="0 0 117 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              id="id12"
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M1 1L5 19.5L36.5 21.5L47.5 23L68.5 29.5L97 37L115 41L106 29.5L85.5 21.5L43.5 14L1 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="13" className="13 absolute top-[64.5%] left-[72.5%]">
          <svg
            width="89"
            height="37"
            viewBox="0 0 122 53"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="opacity-0"
              id="id13"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M35.5 12.5L0.5 1L41 4L68.5 12.5L89.5 18.5L115.5 23.5L121 38L115.5 52.5H103L89.5 34L75 25L35.5 12.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="14" className="14 absolute top-[64.5%] left-[72%]">
          <svg
            width="72"
            height="51"
            viewBox="0 0 106 71"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              id="id14"
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M35 32L1 1L63 18L90 32L104.5 51.5L102 65.5L81 70L61 63L44.5 41L35 32Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="15" className="15 absolute top-[66%] left-[70%]">
          <svg
            width="48"
            height="56"
            viewBox="0 0 74 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              id="id15"
              className="opacity-0"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M10.5 37.5L1 63H22.5L39.5 79.5L59 83.5L73 73.5V63L51.5 35.5L14 2L10.5 37.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="16" className="16 z-20 absolute top-[18%] left-[40%]">
          <svg
            width="86"
            height="129"
            viewBox="0 0 116 179"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="opacity-0"
              id="id16"
              fill="white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M109 25L66 1L56.5 35.5L44.5 60L1.5 120L44.5 177.5L56.5 165.5L114.5 129.5L109 25Z"
              stroke="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Left3;
