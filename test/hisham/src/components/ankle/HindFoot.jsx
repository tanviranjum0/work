import React from "react";

const HindFoot = () => {
  return (
    <div className="w-[90%] text-2xl mx-auto grid md:grid-cols-9 lg:grid-cols-12 md:w-[70%]">
      <div className="col-span-5">
        <div className="gap-3 border-3 flex justify-center items-center rounded-3xl p-2">
          <div className="-rotate-90 -mx-5 text-gray-600">Ankle</div>
          <div className="">
            <svg
              width="115"
              height="138"
              viewBox="0 0 209 252"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                className="z-10 text-4xl font-bold"
                x="45"
                y="140"
                fill="#4a5565"
              >
                Cacanus
              </text>
              <path
                d="M104 1L1 78.5L1.5 251H208.5V79.5L104 1Z"
                strokeWidth={"8"}
                stroke="#9860b3"
              />
            </svg>
          </div>
          <div className="rotate-180">
            <svg
              width="115"
              height="138"
              viewBox="0 0 209 252"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                className="rotate-180 font-bold text-4xl z-10"
                x="-170"
                y="-140"
                fill="#4a5565"
              >
                Equinus
              </text>
              <path
                d="M104 1L1 78.5L1.5 251H208.5V79.5L104 1Z"
                strokeWidth={"8"}
                stroke="#9860b3"
              />
            </svg>
          </div>
        </div>
        <div className="gap-3 border-3 flex justify-center items-center rounded-3xl p-2">
          <div className="-rotate-90 -mx-5 text-gray-600">Hindfoot</div>
          <div className="">
            <svg
              width="120"
              height="122"
              viewBox="0 0 218 222"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                className="z-10 text-4xl font-bold"
                x="75"
                y="125"
                fill="#4a5565"
              >
                Valgus
              </text>
              <path
                d="M78 1L1 111L78 221.5L217 220V1H78Z"
                stroke="#9860b3"
                strokeWidth={"8"}
              />
            </svg>
          </div>
          <div className="rotate-180">
            <svg
              width="120"
              height="122"
              viewBox="0 0 218 222"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                className="z-10 font-bold rotate-180 text-4xl"
                x="-160"
                y="-100"
                fill="#4a5565"
              >
                Varus
              </text>
              <path
                d="M78 1L1 111L78 221.5L217 220V1H78Z"
                stroke="#9860b3"
                strokeWidth={"8"}
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-span-3 my-5 gap-3 border-3 flex justify-center items-center rounded-3xl p-2">
        <div className="-rotate-90">Arch</div>
        <div>
          <div className="">
            <svg
              width="135"
              height="114"
              viewBox="0 0 270 229"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                className="z-10 font-bold  text-4xl"
                x="80"
                y="120"
                fill="#4a5565"
              >
                Cavus
              </text>
              <path
                d="M1 78.5V228.5L269 227.5V78.5L134.5 1L1 78.5Z"
                stroke="#9860b3"
                strokeWidth={"8"}
              />
            </svg>
          </div>
          <div className="rotate-180">
            <svg
              width="135"
              height="114"
              viewBox="0 0 270 229"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                className="z-10 font-bold rotate-180 text-4xl"
                x="-190"
                y="-120"
                fill="#4a5565"
              >
                Planus
              </text>
              <path
                d="M1 78.5V228.5L269 227.5V78.5L134.5 1L1 78.5Z"
                stroke="#9860b3"
                strokeWidth={"8"}
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-span-4 gap-3 my-5 border-3 flex justify-center items-center rounded-3xl p-2">
        <div className="-rotate-90 -mx-5">Forefoot</div>
        <div className=" flex flex-col gap-1">
          <div className="">
            <svg
              width="241"
              height="60"
              viewBox="0 0 482 119"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                className="z-50 text-4xl font-bold"
                x="180"
                y="70"
                fill="#4a5565"
              >
                Pronation
              </text>
              <path
                d="M77 1L1 60.5L78 118H481.5V1H77Z"
                stroke="#9860b3"
                strokeWidth={"8"}
              />
            </svg>
          </div>
          <div className="flex gap-1 justify-center items-center">
            <div className="">
              <svg
                width="120"
                height="104"
                viewBox="0 0 239 208"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  className="z-50 text-4xl font-bold"
                  x="60"
                  y="120"
                  fill="#4a5565"
                >
                  Adductus
                </text>
                <path
                  d="M78 1L1 104.5L78 207.5H238.5V1H78Z"
                  strokeWidth={"8"}
                  stroke="#9860b3"
                />
              </svg>
            </div>
            <div className="rotate-180">
              <svg
                width="120"
                height="104"
                viewBox="0 0 239 208"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  className="z-50 text-4xl rotate-180 font-bold"
                  x="-220"
                  y="-90"
                  fill="#4a5565"
                >
                  Adductus
                </text>
                <path
                  d="M78 1L1 104.5L78 207.5H238.5V1H78Z"
                  stroke="#9860b3"
                  strokeWidth={"8"}
                />
              </svg>
            </div>
          </div>
          <div className="rotate-180">
            <svg
              width="241"
              height="60"
              viewBox="0 0 482 119"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                className="z-50 text-4xl rotate-180 font-bold"
                x="-340"
                y="-50"
                fill="#4a5565"
              >
                Supination
              </text>
              <path
                d="M77 1L1 60.5L78 118H481.5V1H77Z"
                stroke="#9860b3"
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
