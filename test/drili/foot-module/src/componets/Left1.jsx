import { useContext, useEffect } from "react";
import { StoreContext } from "../context/StoreContextMain";
const Left1 = () => {
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
    <div className="flex justify-center items-center">
      <div className="relative border  mt-10 foot3bg bg-gray-400 h-[589px] w-[390px] p-5">
        <div className="1 inline-block absolute z-20 top-[34%] left-[3.5%]">
          <svg
            width="110"
            height="90"
            viewBox="0 0 233 182"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              id="id1"
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

        <div className="2 absolute z-10 top-[24.2%] left-[3%]">
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
              id="id2"
              clipRule="evenodd"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              d="M35 139.5H1V106.5L15.5 79.5L48.5 40.5L88.5 2V79.5L64.5 126L35 139.5Z"

              // stroke=""
            />
          </svg>
        </div>
        <div className="3 absolute z-10 top-0 left-[14%]">
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
              id="id3"
              clipRule="evenodd"
              d="M14 342.5L1 377.5H29.5L56.5 391.5V327.5L106.5 117L121.5 1H96.5L82.5 91L37 227.5L14 252.5V316.5V342.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}

              // stroke=""
            />
          </svg>
        </div>
        <div className="4 absolute z-10 top-0 left-[24%]">
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
              id="id4"
              clipRule="evenodd"
              d="M239 650L223.5 660.5L198 631H158.5L136.5 626L107 588L87 544L29.5 455.5L1 344L53.5 1H117.5V112L115.5 170L117.5 216L122.5 313L126 344L144.5 394.5L158.5 443L167 455.5L206 531.5L226.5 600L239 650Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}

              // stroke=""
            />
          </svg>
        </div>
        <div className="5 absolute z-20 top-1 left-[40%]">
          <svg
            width="49"
            height="170"
            viewBox="0 0 72 277"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              id="id5"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.5 57.5L7 1H70.5L67 30.5L58 113.5L56 181L58 236L20.5 276L7 259.5L1 146.5V107.5L4.5 57.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}

              // stroke=""
            />
          </svg>
        </div>
        <div id="id6" className="6 absolute z-20 top-1 left-[50.5%] ">
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
              id="id6"
              d="M94 257.5L120.5 1H14L1 251L94 257.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}

              // stroke=""
            />
          </svg>
        </div>
        <div id="id7" className="7 absolute z-10 top-[8%] left-[43%]">
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
              id="id7"
              clipRule="evenodd"
              d="M196 398L110 396L87.5 323L57 236.5L25 176L1 111.5L15 104.5L60.5 47V1L150 8L161 141.5L175 188V227L181 271.5L192 337.5L196 398Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}

              // stroke=""
            />
          </svg>
        </div>
        <div id="id8" className="8 absolute z-10 top-[57%] left-[44%]">
          <svg
            width="109"
            height="136"
            viewBox="0 0 201 249"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-0"
              id="id8"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M193.5 226L191 247.5L145 244L113.5 238.5L89.5 228.5L70 215.5L54 181L41 150.5L32 119L1 1L70 6.5L99.5 52.5L113.5 102.5L145 133.5L170.5 153.5L199.5 167L196.5 201.5L193.5 226Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}

              // stroke=""
            />
          </svg>
        </div>
        <div id="id9" className="9 absolute z-20 top-[60%] left-[56.5%]">
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
              id="id9"
              clipRule="evenodd"
              d="M22.5 69.5L17.5 39L1 10L22.5 1L52.5 4.5L67 32.5L114.5 117.5L127.5 126.5L150.5 136L114.5 145L78 126.5L49.5 99.5L22.5 69.5Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}

              // stroke=""
            />
          </svg>
        </div>
        <div id="id10" className="10 absolute z-20 top-[60%] left-[64.5%]">
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
              id="id10"
              clipRule="evenodd"
              d="M33.5 62L1 1H54.5L62 47.5L75 70L105.5 94.5L92 112.5H67L54.5 100.5L33.5 62Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}

              // stroke=""
            />
          </svg>
        </div>
        <div id="id11" className="11 absolute z-10 top-[71%] left-[71%]">
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
              id="id11"
              d="M134 116H119H89.5L68.5 113.5L47 108.5L25.5 101.5L0 86L7.5 12.5L53 0L64.5 5L75.5 12.5L89.5 18L100.5 22L111.5 25L121 28L130.5 32L138.5 35L145.5 37L153.5 40L161 43L165.5 44.5L169 46L172.5 48L176 50L180.5 52.5L184 55L186.5 57.5V64.5V75.5V81L184 86L180.5 93L173.5 101.5L165.5 108.5L155.5 113.5L145.5 116H134Z"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}

              // stroke=""
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Left1;
