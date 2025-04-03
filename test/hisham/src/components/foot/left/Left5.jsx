import { useContext, useEffect } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
const Left5 = () => {
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
      <div className="relative left5bg border mt-10 bg-white h-[589px] w-[390px] p-5">
        <div id="1" className="absolute top-[15.5%] left-[41%]">
          <svg
            width="114"
            height="140"
            viewBox="0 0 127 156"
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
              d="M1 69.5V100L11 144.5L32 154.5L63 150L74.5 144.5L96.5 125L120 95.5L126.5 72.5V48L115.5 13L93 1L58 4.5L26.5 32L1 69.5Z"
            />
          </svg>
        </div>

        <div id="24" className="absolute top-[29%] left-[19%]">
          <svg
            width="91"
            height="181"
            viewBox="0 0 106 208"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath24"
              d="M93.3265 1H68.3878L34.9592 71.5164L7.36735 145.534L1 196.045C1 197.212 5.03265 200.446 21.1633 204.047C37.2939 207.648 46.9864 207.215 49.8163 206.548L69.9796 202.547V173.04L93.3265 81.5188L105 51.0117L97.5714 32.5073L93.3265 1Z"
            />
          </svg>
        </div>
        <div id="23" className="absolute top-[37.5%] left-[35%]">
          <svg
            width="90"
            height="148"
            viewBox="0 0 103 165"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath23"
              d="M28.5 9.5L33.5 1C42.6667 5 65.2 12.3 82 9.5C96.9785 7.00358 101.411 3.52678 101.96 1.62099L102 1C102.036 1.1807 102.027 1.38923 101.96 1.62099L97.5 71L102 140.5C97.3333 141.333 86.8 143.1 82 143.5C77.2 143.9 59.6667 157.333 51.5 164H28.5C24.5 164 11.8333 157.333 6 154L1 116L17 39L28.5 9.5Z"
            />
          </svg>
        </div>
        <div id="21" className="absolute top-[60%] left-[22%]">
          <svg
            width="90"
            height="54"
            viewBox="0 0 99 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath21"
              d="M5 1.22086C2.6 1.62086 1.33333 19.0542 1 27.7209L27 60.2207H94.5C95.6667 45.7207 97.9 16.6207 97.5 16.2207C97.1 15.8207 87 15.3874 82 15.2207L44 1.22086C32 1.05419 7.4 0.820861 5 1.22086Z"
            />
          </svg>
        </div>
        <div id="22b" className="absolute top-[61%] left-[45%]">
          <svg
            width="28"
            height="53"
            viewBox="0 0 32 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath22b"
              d="M30.5 1L1 13.5L2.5 44.5L10 57L22 55.5L28.5 37.5L30.5 1Z"
            />
          </svg>
        </div>
        <div id="22a" className="absolute top-[59.5%] left-[51.4%]">
          <svg
            width="33"
            height="55"
            viewBox="0 0 36 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath22a"
              d="M5.5 62.5L1 50L4 9L12 3.5L30.5 1L35 8L24 52L11 61.5L5.5 62.5Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Left5;
