import { useContext, useEffect } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
const Left2 = () => {
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
      <div className="relative left2bg border mt-10 bg-white h-[589px] w-[390px] p-5">
        <div id="4b" className="absolute top-[26%] left-[23.5%]">
          <svg
            width="39"
            height="138"
            viewBox="0 0 41 149"
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
              d="M24.5 1L3 21.5L1 64L21 130.5V148H36.5L40.5 99V45L24.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="6" className="absolute top-[23%] left-[32.5%]">
          <svg
            width="98"
            height="63"
            viewBox="0 0 107 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath6"
              d="M1 40.5375L3.5 54.0375L96.5 64.0371L106 20.0371L52 5.03748C36.8333 3.53748 6.3 0.637484 5.5 1.03748C4.7 1.43748 2.16667 27.5375 1 40.5375Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7a" className="absolute top-[32.2%] left-[32.5%]">
          <svg
            width="72"
            height="53"
            viewBox="0 0 72 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath7a"
              d="M8.5 1L4 6.5L1 54.5H70.5L66 4L8.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7b" className="absolute top-[33%] left-[49.5%]">
          <svg
            width="32"
            height="78"
            viewBox="0 0 34 81"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath7b"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              d="M1 6C1 4.4 5.66667 2 8 1L22 6L32.5 80H9.5C6.66667 56 1 7.6 1 6Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7c" className="absolute top-[41%] left-[32.5%]">
          <svg
            width="73"
            height="29"
            viewBox="0 0 79 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath7c"
              d="M2.48872 29C-1.11128 29.8 2.65539 10.6667 4.98872 1H75.4883L77.4883 26.5C53.9884 27 6.08872 28.2 2.48872 29Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7d" className="absolute top-[45.5%] left-[32%]">
          <svg
            width="35"
            height="52"
            viewBox="0 0 36 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath7d"
              d="M1 53.5L5 1H33.5L35 53.5H1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7h" className="absolute top-[54.6%] left-[32%]">
          <svg
            width="33"
            height="52"
            viewBox="0 0 34 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath7h"
              d="M1 51V1H33.5V52.5L1 51Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="9" className="absolute top-[63%] left-[27.5%]">
          <svg
            width="60"
            height="52"
            viewBox="0 0 62 51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath9"
              d="M7 48.5L1 35.5L4.5 28C3.33333 30.5 3.2 32.4 12 20C20.8 7.6 20.6667 2.16667 19.5 1H53V13C55.5 20.5 60.6 36 61 38C61.4 40 54.8333 47.1667 51.5 50.5L7 48.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="11" className="absolute top-[72.5%] left-[25%]">
          <svg
            width="68"
            height="72"
            viewBox="0 0 77 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath11"
              d="M60.5 12.5L62.5 4.5L41.5 2L13 1L1 10.5L6 21.5C7 22.8333 9.1 26.6 9.5 31C9.9 35.4 8 37.5 7 38V54L9.5 56.5L19.5 65.5L33 70L49 71L63.5 66.5L75.5 56C75.8333 54 76.4 49.3 76 46.5C75.6 43.7 72.8333 40.3333 71.5 39L64.5 30.5L60.5 20.5V12.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7e" className="absolute top-[45.5%] left-[40.3%]">
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath7e"
              d="M2 28.5L1 1H29V28.5C29 29.7 11 29 2 28.5Z"
              fillOpacity="0.92549"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7f" className="absolute top-[45.5%] left-[48%]">
          <svg
            width="30"
            height="30"
            viewBox="0 0 31 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath7f"
              d="M1 28.5V1H28.5L30 29L1 28.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7g" className="absolute top-[45.5%] left-[54.5%]">
          <svg
            width="23"
            height="30"
            viewBox="0 0 23 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath7g"
              d="M1.5 29L1 1H14.5L22 29H1.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7i" className="absolute top-[50.5%] left-[41.5%]">
          <svg
            width="28"
            height="102"
            viewBox="0 0 28 102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath7i"
              d="M19.5 1H1L7 100.5L26.5 98.5L19.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7j" className="absolute top-[50.5%] left-[48.5%]">
          <svg
            width="25"
            height="100"
            viewBox="0 0 25 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath7j"
              d="M17.5 1H1L3 31.5L6.5 98.5L24 96L17.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7k" className="absolute top-[50.5%] left-[54%]">
          <svg
            width="25"
            height="99"
            viewBox="0 0 25 99"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath7k"
              d="M14.5 1.5L1 1L6.5 66.5L9 98L24 96L22.5 81.5L14.5 1.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="10a" className="absolute top-[67.5%] left-[43%]">
          <svg
            width="34"
            height="32"
            viewBox="0 0 34 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath10a"
              d="M22.5 1L1 2L4.5 30.5L32.5 28.5L22.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="10b" className="absolute top-[67%] left-[50%]">
          <svg
            width="28"
            height="35"
            viewBox="0 0 28 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath10b"
              d="M16.5 1L1 2.5L3.5 21L7.5 33.5L15.5 31L27 26.5L20 5.5L16.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="10c" className="absolute top-[66.5%] left-[56.5%]">
          <svg
            width="28"
            height="35"
            viewBox="0 0 28 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath10c"
              d="M16.5 1L1 2.5L3.5 21L7.5 33.5L15.5 31L27 26.5L20 5.5L16.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="12" className="absolute top-[72.5%] left-[42%]">
          <svg
            width="62"
            height="63"
            viewBox="0 0 62 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath12"
              d="M12 2L1 11L13 30.5C15.1667 35.3333 19.5 46.2 19.5 51C19.5 55.8 24.1667 58.3333 26.5 59L34.5 62C38.5 62.3333 47.6 62.5 52 60.5C56.4 58.5 59.1667 57.3333 60 57C60.3333 53.5 61 46 61 44C61 42 54.3333 36.5 51 34L41.5 17.5L34.5 1L12 2Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="13" className="absolute top-[72%] left-[51%]">
          <svg
            width="61"
            height="67"
            viewBox="0 0 61 67"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath13"
              d="M31.9999 15C24.3999 4.2 23.4999 1.16667 23.9999 1H15L1 7.5L11 24L20.5 38C21.3333 40.1667 23.7 46.3 26.5 53.5C29.3 60.7 29.6667 60.8333 29.5 60L35.5 64.5L42.5 66C43.8333 66 47.5 65.7 51.5 64.5C55.5 63.3 58.8333 59.6667 60 58L58.5 46L48.5 35.5C46.1666 33.1667 39.5999 25.8 31.9999 15Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="14" className="absolute top-[71%] left-[57.5%]">
          <svg
            width="62"
            height="58"
            viewBox="0 0 62 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath14"
              d="M18 1L1 11.5L23 43.5L34 55.5L43 61.5H53.5L61 55.5L59 40L44.5 22L27.5 11.5L18 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="15" className="absolute top-[69.5%] left-[61.5%]">
          <svg
            width="38"
            height="40"
            viewBox="0 0 38 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
              id="footpath15"
              d="M20 1L1 8L11.5 20.5L24 27L36.5 38L35 27L30 14L20 1Z"
              stroke="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Left2;
