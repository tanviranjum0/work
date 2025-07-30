import { useContext, useEffect } from "react";
import { StoreContext } from "../context/StoreContextMain";
const Right6 = () => {
  const { zone, increasePain } = useContext(StoreContext);
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
            newPoint.setAttribute("fill", "#DC4D01");
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
  const handleMouseEnter = (e) => {
    e.target.classList.add("opacity-20");
    e.target.setAttribute("stroke", "black");
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove("opacity-20");
    e.target.setAttribute("stroke", "none");
  };
  const handleClick = async (e) => {
    increasePain(e.target.getAttribute("id"));
  };
  return (
    <div className="flex justify-center -items-center ">
      <div className="relative border -scale-x-100 mt-10 left6bg bg-gray-400 h-[589px] w-[390px] p-5">
        <div id="1" className="1  absolute top-[78%] left-[49%]">
          <svg
            width="95"
            height="39"
            viewBox="0 0 105 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              id="id1"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M54 18.5L1 12.5V24.5V31.5L38.5 38.5H81L104.5 18.5V1L54 18.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="2" className="2 absolute top-[65%] left-[50%]">
          <svg
            width="85"
            height="88"
            viewBox="0 0 94 88"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              onMouseEnter={handleMouseEnter}
              id="id2"
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M18 8.50007C37.0602 6.81829 71.6532 3.58088 80.5137 2.11759C80.7735 1.21438 81.4915 1.21192 82.5 1.50007C82.9455 1.62736 82.1902 1.84071 80.5137 2.11759C79.8719 4.34882 82.0256 12.077 89.5 34.5001C97.9 59.7001 88.3333 80.3334 82.5 87.5H1.5L18 73V41.5V8.50007Z"
            />
            <path
              className="opacity-0"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M18 8.50007C40.6667 6.50007 85.3 2.30007 82.5 1.50007C79 0.500072 79 3.00007 89.5 34.5001C97.9 59.7001 88.3333 80.3334 82.5 87.5H1.5L18 73V41.5V8.50007Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="3" className="3 absolute top-[45%] left-[50%]">
          <svg
            width="71"
            height="126"
            viewBox="0 0 80 134"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              id="id3"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M79.5 123V1L1 15L22 132.5L79.5 123Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="18" className="18 absolute z-10 top-[33%] left-[38%]">
          <svg
            width="65"
            height="272"
            viewBox="0 0 66 288"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              onMouseEnter={handleMouseEnter}
              id="id18"
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M1.5 1H18L55.5 197L65 253.5C60.7845 263.738 53.4954 283.223 54.779 286.895C55.8763 287.276 56.2155 287.5 55.5 287.5C55.152 287.5 54.9164 287.288 54.779 286.895C50.3558 285.359 33.6149 281.27 24 279C25.5 263 30.4 226.3 38 207.5C45.6 188.7 41.1667 173 38 167.5L1.5 1Z"
            />
            <path
              className="opacity-0"
              onMouseEnter={handleMouseEnter}
              id="id18"
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M18 1H1.5L38 167.5C41.1667 173 45.6 188.7 38 207.5C30.4 226.3 25.5 263 24 279C36 281.833 59.1 287.5 55.5 287.5C51.9 287.5 60.3333 264.833 65 253.5L55.5 197L18 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="19" className="19 absolute top-[65%] left-[30%]">
          <svg
            width="53"
            height="80"
            viewBox="0 0 53 79"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              onMouseEnter={handleMouseEnter}
              id="id19"
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M0.5 1V37.5L52 77.5V19L0.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="25" className="25 absolute top-0 left-[34%]">
          <svg
            width="130"
            height="276"
            viewBox="0 0 148 292"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              onMouseEnter={handleMouseEnter}
              id="id25"
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M138 1L1 28L65.5 291L147.5 279.5V192.5L138 1Z"
              stroke="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Right6;
