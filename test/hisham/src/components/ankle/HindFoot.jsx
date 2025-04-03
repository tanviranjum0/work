import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
const HindFoot = () => {
  const { hindFootZones, increaseHindFootZones } = useContext(StoreContext);
  useEffect(() => {
    const iterator = async () => {
      for (const id in hindFootZones) {
        if (hindFootZones[id] == 2) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "yellow");
          });
        } else if (hindFootZones[id] == 3) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "#ffa361");
          });
        } else if (hindFootZones[id] == 1) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "#00c951");
          })
        } else if (hindFootZones[id] == 4) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "red");
          });
        } else if (hindFootZones[id] == 0) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "white");
          });
        }
      }
    };
    iterator();
  }, [hindFootZones]);

  const handleClick = async (e) => {
    increaseHindFootZones(e.target.getAttribute("id"));
  };
  const handleMouseEnter = (e) => {
    e.target.classList.add("opacity-90");
    e.target.setAttribute("stroke", "#9e24bf");
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove("opacity-90");
    e.target.setAttribute("stroke", "#cd61ff");
  };
  return (
    <div className="w-[90%] select-none text-2xl mx-auto grid md:grid-cols-9 lg:grid-cols-12 md:w-[70%]">
      <div className="col-span-5">
        <div className="gap-3 border-3 flex justify-center -pt-5   items-center rounded-3xl p-2">
          <div className="-rotate-90 -mx-5 text-gray-600 font-semibold">Ankle</div>
          <div className="">
            <span className="top-20 z-10 left-2.5 font-semibold text-gray-600 relative">Calcanus</span>
            <svg
              width="115"
              height="138"
              viewBox="0 0 209 252"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                id="calcanus"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M104 1L1 78.5L1.5 251H208.5V79.5L104 1Z"
                stroke="#cd61ff"
                strokeWidth={"8"}
              />
            </svg>
          </div>
          <div className="rotate-180 -mb-16">
            <div className="rotate-180">
              <span className="z-10 relative left-3 bottom-20 font-semibold text-gray-600">Equinus</span>
            </div>
            <svg
              width="115"
              height="138"
              viewBox="0 0 209 252"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                id="equinus"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M104 1L1 78.5L1.5 251H208.5V79.5L104 1Z"
                strokeWidth={"8"}
                stroke="#cd61ff"
              />
            </svg>
          </div>
        </div>
        <div className="gap-3 border-3 flex justify-center items-center rounded-3xl p-2">
          <div className="-rotate-90 -mx-5 text-gray-600 font-semibold">Hindfoot</div>
          <div className="">
            <span className="top-18 z-10 left-8 font-semibold text-gray-600 relative">Valgus</span>
            <svg
              width="120"
              height="122"
              viewBox="0 0 218 222"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                id="valgus"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M78 1L1 111L78 221.5L217 220V1H78Z"
                stroke="#cd61ff"
                strokeWidth={"8"}
              />
            </svg>
          </div>
          <div className="rotate-180 -mb-16">
            <div className="rotate-180">
              <span className="z-10 relative left-3 bottom-20 font-semibold text-gray-600">Varus</span>
            </div>
            <svg
              width="120"
              height="122"
              viewBox="0 0 218 222"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                id="varus"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M78 1L1 111L78 221.5L217 220V1H78Z"
                stroke="#cd61ff"
                strokeWidth={"8"}
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-span-3 my-5 gap-3 border-3 flex justify-center items-center rounded-3xl p-2">
        <div className="-rotate-90 font-semibold">Arch</div>
        <div>
          <div className="">
            <span className="top-20 z-10 left-9 font-semibold text-gray-600 relative">Cavus</span>
            <svg
              width="135"
              height="114"
              viewBox="0 0 270 229"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                id="cavus"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M1 78.5V228.5L269 227.5V78.5L134.5 1L1 78.5Z"
                stroke="#cd61ff"
                strokeWidth={"8"}
              />
            </svg>
          </div>
          <div className="rotate-180">
            <div className="rotate-180">
              <span className="z-10 relative left-8 bottom-20 font-semibold text-gray-600">Planus</span>
            </div>
            <svg
              width="135"
              height="114"
              viewBox="0 0 270 229"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                id="planus"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M1 78.5V228.5L269 227.5V78.5L134.5 1L1 78.5Z"
                stroke="#cd61ff"
                strokeWidth={"8"}
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-span-4 gap-3 my-5 border-3 flex justify-center items-center rounded-3xl p-2">
        <div className="-rotate-90 font-semibold -mx-5">Forefoot</div>
        <div className=" flex flex-col gap-1">
          <div className="">
            <span className="top-11 z-10 left-18 font-semibold text-gray-600 relative">Pronation</span>
            <svg
              width="241"
              height="60"
              viewBox="0 0 482 119"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                id="pronation"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M77 1L1 60.5L78 118H481.5V1H77Z"
                stroke="#cd61ff"
                strokeWidth={"8"}
              />
            </svg>
          </div>
          <div className="flex gap-1 -mt-5 justify-center items-center">
            <div className="">
              <span className="top-16 z-10 left-3 font-semibold text-gray-600 relative">Adductus</span>
              <svg
                width="120"
                height="104"
                viewBox="0 0 239 208"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >

                <path
                  id="adductus"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
                  d="M78 1L1 104.5L78 207.5H238.5V1H78Z"
                  strokeWidth={"8"}
                  stroke="#cd61ff"
                />
              </svg>
            </div>
            <div className="rotate-180 -mb-16">
              <div className="rotate-180">
                <span className="z-10 relative bottom-18 left-1 font-semibold text-gray-600">Adductus
                </span>
              </div>
              <svg
                width="120"
                height="104"
                viewBox="0 0 239 208"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >

                <path
                  id="adductus2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
                  d="M78 1L1 104.5L78 207.5H238.5V1H78Z"
                  stroke="#cd61ff"
                  strokeWidth={"8"}
                />
              </svg>
            </div>
          </div>
          <div className="rotate-180">
            <div className="rotate-180">
              <span className="z-10 relative bottom-12 left-16 font-semibold text-gray-600">Supination
              </span>
            </div>
            <svg
              width="241"
              height="60"
              viewBox="0 0 482 119"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                id="supination"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                d="M77 1L1 60.5L78 118H481.5V1H77Z"
                stroke="#cd61ff"
                strokeWidth={"8"}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HindFoot;
