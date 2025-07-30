import { useContext, useEffect } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
const Left4 = () => {
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
      <div className="relative left4bg border mt-10 bg-white h-[589px] w-[390px] p-5">
        <div id="18" className="absolute top-[0%] left-[32.5%]">
          <svg
            width="47"
            height="317"
            viewBox="0 0 59 397"
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
              d="M58.5 266V90.5L34 3.5C33.5 2.66667 29.5 1 17.5 1C16.7 2.2 20.8333 58.5 23 86.5L21.5 170.5L13.5 232L10 279.5L19.5 315.5L1 394.5L33.5 360C33.6667 353.5 34.5 338.8 36.5 332C38.5 325.2 40.3333 320.833 41 319.5L58.5 266Z"
            />
          </svg>
        </div>
        <div id="4a" className="absolute top-[0%] left-[58.6%]">
          <svg
            width="43"
            height="271"
            viewBox="0 0 54 339"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath4a"
              d="M53 1H39H34.5L18 138L11.5 201.5L1 272.5L8 324L12.5 337C26 313.333 53 259.1 53 231.5C53 197 39 146.5 39 145.5V70L53 1Z"
            />
          </svg>
        </div>
        <div id="3" className="absolute top-[12%] left-[44.5%]">
          <svg
            width="71"
            height="146"
            viewBox="0 0 89 183"
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
              d="M88 1L2.5 3L1 100V182H66.5L70.5 150.5L88 23.5V1Z"
            />
          </svg>
        </div>
        <div id="2" className="absolute top-[36.5%] left-[40%]">
          <svg
            width="80"
            height="72"
            viewBox="0 0 104 91"
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
              d="M3.68801 61.5C-0.311993 68.7 1.02134 80.5 2.18801 85.5L102.688 89.5V72.5L92.6875 43V1H27.1875C21.021 18.1667 7.68801 54.3 3.68801 61.5Z"
            />
          </svg>
        </div>
        <div id="4b" className="absolute top-[37%] left-[60.5%]">
          <svg
            width="35"
            height="114"
            viewBox="0 0 43 143"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath4b"
              d="M20 39L1 87.5L27.5 140.5L42 58L39.5 2L20 39Z"
            />
          </svg>
        </div>
        <div id="1" className="absolute top-[49%] left-[33%]">
          <svg
            width="120"
            height="76"
            viewBox="0 0 150 96"
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
              d="M134.738 6.5L30.2382 1C22.4049 10 5.8382 29.3 2.2382 34.5C-1.3618 39.7 3.7382 57 6.7382 65C19.2382 71.3333 49.8382 85.5 72.2382 91.5C94.6382 97.5 111.572 94 117.238 91.5L148.238 76.5V62C148.905 55.3333 149.838 40.5 148.238 34.5C146.638 28.5 138.572 13.3333 134.738 6.5Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Left4;
