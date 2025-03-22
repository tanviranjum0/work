import { useContext, useEffect } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
const Left1 = () => {
  const { footZone, increaseFootPain } = useContext(StoreContext);
  useEffect(() => {
    const iterator = async () => {
      for (const id in footZone) {
        if (footZone[id] == 1) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.add("opacity-35");
            newPoint.setAttribute("fill", "yellow");
          });
        } else if (footZone[id] == 2) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "#DC4D01");
          });
        } else if (footZone[id] == 3) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "red");
          });
        } else if (footZone[id] == 0) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "white");
            newPoint.classList.remove("opacity-35");
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
      <div className="relative left1bg border mt-10 bg-white h-[589px] w-[390px] p-5">
        <div id="3" className="absolute top-[0%] left-[15.5%]">
          <svg
            width="64"
            height="168"
            viewBox="0 0 65 171"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.88344 170.5C0.283443 170.9 1.21678 152.333 1.88344 143L13.3828 127L43.8828 35L45.8828 1H63.8828L58.3828 53.5L43.3828 107.5L9.38281 169C7.54969 169.333 3.48344 170.1 1.88344 170.5Z"
              id="footpath3"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="2" className="absolute top-[23%] left-[3%]">
          <svg
            width="51"
            height="82"
            viewBox="0 0 55 89"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath2"
              d="M3.50479 84.4152C3.22336 83.5915 1.81372 80.0343 1 78V67.5L5 57L9.5 51L20 37.5L53.5 2L52 51L39.5 78C34 80.1667 22.4 85 20 87C17.1146 89.4045 4.05398 83.9462 3.50479 84.4152C3.56921 84.6037 3.57451 84.649 3.5 84.5C3.48089 84.4618 3.48297 84.4338 3.50479 84.4152Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="1" className="absolute top-[33.5%] left-[3.5%]">
          <svg
            width="107"
            height="98"
            viewBox="0 0 112 102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath1"
              d="M22 18.5409L1 17.0409L6 32.041L26.5 60.541L56.5 83.041L91 100.541H104L110.5 65.541L83.5 17.0409C73.1667 11.3742 52.6 0.240904 53 1.0409C53.4 1.8409 32.5 13.0409 22 18.5409Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="4a" className="absolute top-[0%] left-[27%]">
          <svg
            width="57"
            height="180"
            viewBox="0 0 58 184"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath4a"
              d="M53 1H17.5L14 45V85.5L11 112.5L1 182.5L56.5 174.5L53 100.5V1Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="5a" className="absolute top-[3.5%] left-[39.2%]">
          <svg
            width="54"
            height="150"
            viewBox="0 0 54 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath5a"
              d="M52.5 1H1V66L4 110L7.5 149L44.5 141L42.5 66L52.5 1Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="4b" className="absolute top-[29%] left-[26%]">
          <svg
            width="110"
            height="165"
            viewBox="0 0 119 173"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath4b"
              d="M4.5 70.5L1 15C7.16667 11.5 20.1 4.2 22.5 3C24.9 1.8 47.8333 1.16667 59 1L61 13L79 54.5L106 110.5L118 157C110.479 161.8 95.9232 171.209 95.4805 171.953C95.5247 171.984 95.532 172 95.5 172C95.468 172 95.462 171.984 95.4805 171.953C94.4179 171.209 72.0208 161.8 60.5 157L27.5 114.5L4.5 70.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="8" className="rotate-2 absolute top-[56.5%] left-[41%]">
          <svg
            width="120"
            height="130"
            viewBox="0 0 124 134"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath8"
              d="M1 0.954102L42.1093 1.12355L61.9259 26.8199L70.6653 51.7773L100.63 79.2791L122.802 88.2736L121.412 133.477C110.048 133.426 83.0616 132.616 66.026 129.782C48.9904 126.948 48.5613 123.637 50.4763 122.335L18.6678 46.3452L1 0.954102Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="11" className=" absolute top-[71%] left-[68%]">
          <svg
            width="98"
            height="62"
            viewBox="0 0 106 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath11"
              d="M2.1043 29.5C0.104303 33.1 1.27097 45 2.1043 50.5L19.1035 59.5L44.6035 65.5C55.9368 66.1667 79.7035 67.5 84.1035 67.5C88.5035 67.5 95.2702 62.1667 98.1035 59.5L105.104 46V34L102.604 31.5L44.6035 8.5L33.6035 1L10.1035 8.5C8.27044 14 4.1043 25.9 2.1043 29.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="9" className=" absolute top-[61%] left-[59%]">
          <svg
            width="68"
            height="64"
            viewBox="0 0 74 69"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath9"
              d="M9 10.5L1 27L31 57.5L53 68L72 61L53 48.5L42 30L25 1L9 10.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="7h" className="absolute top-[44%] left-[53.5%]">
          <svg
            width="51"
            height="130"
            viewBox="0 0 53 134"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath7h"
              d="M48 1L46 16L51.5 105L31.5 115.5L20.5 132L16.5 89.5L10.5 62L1 14L48 1Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="10a" className="absolute top-[59.5%] left-[64%]">
          <svg
            width="47"
            height="60"
            viewBox="0 0 49 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath10a"
              d="M27 1L1 8.5L25 56L33.5 62L47.5 57.5L38 44L29 23.5L27 1Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="7d" className="absolute top-[38.5%] left-[48%]">
          <svg
            width="66"
            height="48"
            viewBox="0 0 69 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath7d"
              d="M6.65804 33C1.05804 26.2 0.65804 15.8333 1.15804 11.5L16.6582 13L33.1582 11.5L53.6582 8L63.6582 1L68.1582 18.5L66.1582 36L39.1582 45L15.1582 49C14.6581 46.5 12.258 39.8 6.65804 33Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="7c" className="absolute top-[32%] left-[47.5%]">
          <svg
            width="72"
            height="50"
            viewBox="0 0 76 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath7c"
              d="M1.55031 53C-0.0496887 53.4 2.21698 27.1667 3.55031 14L67.5508 1L74.5508 38C71.5508 40.1667 64.6508 45.2 61.0508 48C57.4508 50.8 41.5508 52.5 34.0508 53C23.884 52.8333 3.15031 52.6 1.55031 53Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="5b" className="absolute top-[27.5%] left-[42%]">
          <svg
            width="40"
            height="40"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath5b"
              d="M40 1L2 9.5L1 18.5L10.5 41.5H26L33.5 38.5L41.5 34V11.5L40 1Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="7a" className="absolute top-[25%] left-[52%]">
          <svg
            width="48"
            height="50"
            viewBox="0 0 55 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath7a"
              d="M1 53V1L52.5 5L53.5 43L1 53Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
        <div id="6" className="absolute top-[16%] left-[50%]">
          <svg
            width="57"
            height="60"
            viewBox="0 0 63 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="footpath6"
              d="M61.5 1H2.5L1 57L56.5 62L61.5 1Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              fill="yellow"
              className="opacity-0"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Left1;
