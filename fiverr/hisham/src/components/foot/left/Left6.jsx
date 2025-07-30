import { useContext, useEffect } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
const Left6 = () => {
  const { footZone, increaseFootPain } = useContext(StoreContext);
  useEffect(() => {
    const iterator = async () => {
      for (const id in footZone) {
        if (footZone[id] == 1) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.add("opacity-60");
            newPoint.setAttribute("fill", "#119920");
          });
        } else if (footZone[id] == 2) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "yellow");
          });
        } else if (footZone[id] == 3) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "orange");
          });
        } else if (footZone[id] == 4) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "red");
          });
        } else if (footZone[id] == 0) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "white");
            newPoint.classList.remove("opacity-60");
          });
        }
      }
    };
    iterator();
  }, [footZone]);

  const handleClick = async (e) => {
    increaseFootPain(e.target.getAttribute("id"));
  };
  const handleMouseEnter = (e) => {
    e.target.classList.add("opacity-20");
    e.target.setAttribute("stroke", "black");
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove("opacity-20");
    e.target.setAttribute("stroke", "none");
  };
  return (
    <div className="flex justify-center items-center">
      <div className="relative left6bg border mt-10 bg-white h-[589px] w-[390px] p-5">
        <div id="25" className="absolute top-[0%] left-[32.5%]">
          <svg
            width="138"
            height="266"
            viewBox="0 0 144 278"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath25"
              d="M59.5 277L1 24.5L136.5 1L139.5 75.5L143.5 266.5L85.5 277H59.5Z"
            />
          </svg>
        </div>
        <div id="3" className="absolute top-[44.5%] left-[47%]">
          <svg
            width="87"
            height="129"
            viewBox="0 0 87 129"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath3"
              d="M80.5 1L1 10L5.49111 33.5L22.5 122.5L49.5 128.5L85.5 122.5L80.5 1Z"
            />
          </svg>
        </div>
        <div id="2" className="absolute top-[65.5%] left-[49%]">
          <svg
            width="101"
            height="94"
            viewBox="0 0 101 94"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath2"
              d="M69.5 4C62.8333 5.16667 43.6 7.6 20 8V47L14.5 77.5L1 85.5C1.33333 86.3333 5.6 88.7 20 91.5C34.4 94.3 41.6667 92.6667 43.5 91.5C54.8333 89 79.5 83.4 87.5 81C95.5 78.6 99.1667 73 100 70.5L85.5 25.5L82 1L69.5 4Z"
            />
          </svg>
        </div>
        <div id="1" className="absolute top-[77%] left-[46%]">
          <svg
            width="114"
            height="50"
            viewBox="0 0 114 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath1"
              d="M8 22L1.5 30.5L1 31L15.5 42L30 47L52 49.5L81.5 47L101 39.5C103.833 35.6667 110 27.1 112 23.5C114 19.9 112.833 7.66667 112 2C109.333 5.83333 103.4 13.9 101 15.5C98.6 17.1 90.6667 19.8333 87 21L55 27H32.5L8 22Z"
            />
          </svg>
        </div>
        <div id="18" className="absolute top-[30%] left-[37%]">
          <svg
            width="64"
            height="282"
            viewBox="0 0 64 282"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath18"
              d="M63.5 245.5L59.5 213L31 77.5L15 1L1 5L20.5 82L42.5 183.5L40.5 207L30 228.5L25.5 276L35 281L56.5 276L63.5 245.5Z"
            />
          </svg>
        </div>
        <div id="19" className="absolute top-[65%] left-[31.5%]">
          <svg
            width="50"
            height="71"
            viewBox="0 0 50 71"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath19"
              d="M1 26L4 1L48.5 19.5L43 69.5L1 26Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Left6;
