import React from "react";

const Feet = () => {
  const handleMouseEnter = (e) => {
    console.log("hello");
    e.target.classList.add("opacity-20");
    e.target.setAttribute("stroke", "black");
  };
  const handleMouseLeave = (e) => {
    console.log("hola");
    e.target.classList.remove("opacity-20");
    e.target.setAttribute("stroke", "none");
  };
  return (
    <div className="flex justify-center items-center">
      <div className="relative feet border mt-10 bg-gray-400 h-[589px] w-[390px] p-5">
        <div id="1" className="absolute top-[23.5%] left-[15%]">
          <svg
            width="50"
            height="50"
            viewBox="0 0 81 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-1"
              d="M80 6.5L23.5 78.5L6 67L1 50L10.5 17.5L38 1L80 6.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="2" className="absolute top-[24.5%] left-[19%]">
          <svg
            width="60"
            height="54"
            viewBox="0 0 100 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-2"
              d="M18.5 89.5L1 75.5L54 2L58.5 1L78 14.5L99 33L52 89.5H18.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="3" className="absolute top-[33.5%] left-[7%]">
          <svg
            width="40"
            height="33"
            viewBox="0 0 58 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-3"
              d="M9 47.5L1 33L6 13L30 1L56.5 9.5L54 33L44 49L9 47.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="4" className="absolute top-[40.5%] left-[5.5%]">
          <svg
            width="34"
            height="27"
            viewBox="0 0 54 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-4"
              d="M6.5 26L1 8L34 1L53.5 8V30.5L18.5 38L6.5 26Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="5" className="absolute top-[45.5%] left-[5.5%]">
          <svg
            width="33"
            height="28"
            viewBox="0 0 48 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-5"
              d="M1 29.5V10.5L10 1L29 3.5L47 12.5V29.5L39 36L14.5 43L1 29.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="6" className="absolute top-[51%] left-[7%]">
          <svg
            width="38"
            height="26"
            viewBox="0 0 58 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-6"
              d="M7 30L1 10.5L14 1H26L41.5 5.5L56.5 25.5C58 27.5 50.5 42 50.5 43C50.5 43.8 34.1667 45 26 45.5L7 30Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="7" className="absolute top-[32%] left-[30.5%]">
          <svg
            width="89"
            height="70"
            viewBox="0 0 132 104"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-7"
              d="M25.5 6.5L4.5 31L1 36L25.5 67L83 103L114.5 95L131 67L123 36L114.5 22L98.5 13.5L87.5 6.5L71.5 1L25.5 6.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="8" className="absolute top-[38.5%] left-[21.5%]">
          <svg
            width="82"
            height="54"
            viewBox="0 0 116 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-8"
              d="M19 6L1 26.5L19 47L65.5 69.5L91.5 80.5L115 58C112.667 50.8333 107.9 36.7 107.5 37.5C107.1 38.3 96.6667 30.5 91.5 26.5L65.5 9L41.5 1L19 6Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="9" className="absolute top-[43.5%] left-[20%]">
          <svg
            width="63"
            height="48"
            viewBox="0 0 90 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-9"
              d="M29 1L7 6L1 34.5L74.5 57L88.5 40.5L85.5 25.5L29 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="10" className="absolute top-[49%] left-[19%]">
          <svg
            width="54"
            height="35"
            viewBox="0 0 75 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-10"
              d="M1 9V35L60 51L69 47.5L74 18L21.5 1L1 9Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="11" className="absolute top-[53.5%] left-[20%]">
          <svg
            width="48"
            height="53"
            viewBox="0 0 74 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-11"
              d="M19.5 1L1 9.5V47L21.5 74.5L50 83.5L66.5 61.5L73 24L59 13.5L19.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="12" className="absolute top-[40%] left-[51%]">
          <svg
            width="42"
            height="43"
            viewBox="0 0 63 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-12"
              d="M1 26L2.5 32.5L34 63H39.5L62.5 40V32.5L31.5 1H25.5L1 26Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="13" className="absolute top-[43.5%] left-[45.5%]">
          <svg
            width="42"
            height="43"
            viewBox="0 0 63 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-13"
              d="M24.6246 1.03117C20.2246 1.83117 7.12456 17.3645 1.12456 25.0312C0.791225 27.1979 0.924559 32.5312 4.12456 36.5312C7.32456 40.5312 24.1246 56.1979 32.1246 63.5312L40.1246 61.5312L62.1246 38.5312V32.5312L50.6246 22.5312C43.7912 15.0312 29.0246 0.231167 24.6246 1.03117Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="14" className="absolute top-[47%] left-[39%]">
          <svg
            width="42"
            height="42"
            viewBox="0 0 63 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-14"
              d="M22.5 1L1 24V31L5 35L28.5 58.5C31.1667 59.3333 37.1 60.8 39.5 60C41.9 59.2 42.8333 58.6667 43 58.5L61.5 39C62.1667 37.3333 62.3 32.6 57.5 27L43 11.5C39.5 8 30.5 1 22.5 1Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="15" className="absolute top-[51%] left-[34%]">
          <svg
            width="41"
            height="41"
            viewBox="0 0 62 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-15"
              d="M22 1L1 24.5L5.5 41.5L12.5 51L24.5 57L33 62.5L39 61L61 39L60 30.5L30 1H22Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="16" className="absolute top-[56%] left-[30%]">
          <svg
            width="121"
            height="85"
            viewBox="0 0 173 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_2012_12)">
              <path d="M5 55L11.5 41.5L21.785 2.8089C21.6767 2.42717 21.7687 2.16191 22 2L21.785 2.8089C22.4568 5.17776 30.8405 12.0315 61.5 26.5C97.1 43.3 124 54.8333 133 58.5L161 73L168.5 97.5V113H137.5L69 85.5L5 55Z" />
              <path
                d="M5 55L11.5 41.5L21.785 2.8089C21.6767 2.42717 21.7687 2.16191 22 2L21.785 2.8089C22.4568 5.17776 30.8405 12.0315 61.5 26.5C97.1 43.3 124 54.8333 133 58.5L161 73L168.5 97.5V113H137.5L69 85.5L5 55Z"
                stroke="black"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_2012_12"
                x="0.332031"
                y="0.805176"
                width="172.668"
                height="120.695"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2012_12"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2012_12"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
        <div id="17" className="absolute top-[45%] left-[58%]">
          <svg
            width="42"
            height="41"
            viewBox="0 0 63 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-17"
              d="M1 26L2.5 32.5L34 63H39.5L62.5 40V32.5L31.5 1H25.5L1 26Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="18" className="absolute top-[48%] left-[52%]">
          <svg
            width="42"
            height="42"
            viewBox="0 0 62 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-18"
              d="M24.9127 1.01747C18.5127 1.41747 7.91273 15.5175 3.41273 22.5175V28.0176C2.91273 28.3509 1.61273 29.0175 0.412734 29.0175H1.91273L30.4127 58.0176L36.4127 59.5176L42.9127 55.0176L58.9127 40.0176L60.9127 34.5176V30.5176C60.7461 31.3509 59.7127 31.5176 56.9127 25.5176C54.1127 19.5176 45.0794 13.0175 40.9127 10.5175C38.2461 7.18414 31.3127 0.617474 24.9127 1.01747Z"
            />
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-18"
              d="M3.41273 29.0175V28.0176M3.41273 28.0176V22.5175C7.91273 15.5175 18.5127 1.41747 24.9127 1.01747C31.3127 0.617474 38.2461 7.18414 40.9127 10.5175C45.0794 13.0175 54.1127 19.5176 56.9127 25.5176C59.7127 31.5176 60.7461 31.3509 60.9127 30.5176V34.5176L58.9127 40.0176L42.9127 55.0176L36.4127 59.5176L30.4127 58.0176L1.91273 29.0175C0.912734 29.0175 -0.787267 29.0175 0.412734 29.0175C1.61273 29.0175 2.91273 28.3509 3.41273 28.0176Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="19" className="absolute top-[51.5%] left-[46.5%]">
          <svg
            width="42"
            height="40"
            viewBox="0 0 60 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-19"
              d="M1 24V29L30 57.5H38L59 36L57 29L30 1H22.5L1 24Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="20" className="absolute top-[51.5%] left-[46.5%]">
          <svg
            width="42"
            height="40"
            viewBox="0 0 60 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-20"
              d="M1 24V29L30 57.5H38L59 36L57 29L30 1H22.5L1 24Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="21" className="absolute top-[54.5%] left-[41.5%]">
          <svg
            width="40"
            height="36"
            viewBox="0 0 60 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-21"
              d="M1 26.5V39L13 44.5L27 54.5H43L59.5 37V30L30.5 1H24.5L1 26.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="22" className="absolute top-[49%] left-[66%]">
          <svg
            width="40"
            height="37"
            viewBox="0 0 56 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-22"
              d="M1 21.031L1.5 28.031L17 46.531C20.1667 48.6977 28.1 53.031 34.5 53.031C40.9 53.031 49.8333 40.3643 53.5 34.031L54.5 28.031L49 23.031L33 6.03103C31.1667 4.19769 26.6 0.631026 23 1.03103C19.4 1.43103 6.83333 14.531 1 21.031Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="23" className="absolute top-[52%] left-[61.5%]">
          <svg
            width="36"
            height="38"
            viewBox="0 0 54 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-23"
              d="M27.5 54.5L1 26.5V20.5L21 1H26L53 28.5V34.5L33.5 54.5H27.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="24" className="absolute top-[55%] left-[56.5%]">
          <svg
            width="38"
            height="37"
            viewBox="0 0 54 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-24"
              d="M1 21V30L25 54.5H32L53 35V27.5L27.5 1H22L1 21Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="25" className="absolute top-[58.5%] left-[51.5%]">
          <svg
            width="39"
            height="32"
            viewBox="0 0 56 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-25"
              d="M1 22.5492V33.0492C10.3333 38.5493 31 49.4493 39 49.0493C47 48.6493 52.6667 38.2159 54.5 33.0492L52.5 25.5493L42 14.0493C37.5 9.38264 27.3 0.249306 22.5 1.04931C16.5 2.04931 1 23.5492 1 22.5492Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="26" className="absolute top-[53.5%] left-[73%]">
          <svg
            width="35"
            height="35"
            viewBox="0 0 51 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-26"
              d="M1 24.5V19L19 1H25.5L50.5 24.5V32L25.5 50.5L1 24.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="27" className="absolute top-[56%] left-[67.5%]">
          <svg
            width="35"
            height="35"
            viewBox="0 0 51 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-27"
              d="M2.5 27.5L1 21L19 1L26 2L50 25.5V31.5L31.5 50.5L22 48.5L2.5 27.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="28" className="absolute top-[59%] left-[63.5%]">
          <svg
            width="35"
            height="35"
            viewBox="0 0 51 51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-28"
              d="M4 31L1 23L18.5 1H26L50 25V32L37 42.5L29.5 49.5L22.5 47L4 31Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="29" className="absolute top-[62.5%] left-[59.5%]">
          <svg
            width="35"
            height="35"
            viewBox="0 0 53 53"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-29"
              d="M33.5 51.5L13.5 48.5L1 31.5L3 21L23.5 1H27.5L52.5 26V31.5L33.5 51.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="30" className="absolute top-[57%] left-[79%]">
          <svg
            width="30"
            height="30"
            viewBox="0 0 47 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-29"
              d="M1 25.5L3 19.5L19.5 1L27 2.5L46 19.5V27.5L27 43.5H19.5L1 25.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="31" className="absolute top-[60%] left-[74.5%]">
          <svg
            width="30"
            height="31"
            viewBox="0 0 49 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-31"
              d="M1 24.5096V19.0096C7.66667 12.8429 21.6 0.609574 24 1.00957C26.4 1.40957 36 10.8429 40.5 15.5096L47.5 29.0096C41.5 35.6762 28.1 48.6096 22.5 47.0096C16.9 45.4096 5.83333 31.3429 1 24.5096Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="32" className="absolute top-[63%] left-[69%]">
          <svg
            width="36"
            height="36"
            viewBox="0 0 53 53"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-32"
              d="M26.5 48.5L1 23.5L20.5 1L26.5 2.5L52 26.5V33.5L33 51.5L26.5 48.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="33" className="absolute top-[66%] left-[64.5%]">
          <svg
            width="30"
            height="30"
            viewBox="0 0 47 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-33"
              d="M1 30.5V20.5L22 1L29.5 3L46 20.5L44 26.5L26 43.5L7 42L1 30.5Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="34" className="absolute top-[59%] left-[78%]">
          <svg
            width="83"
            height="90"
            viewBox="0 0 133 149"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-34"
              d="M20 54L1 73.5L33 91.5L65.5 109.5L120.5 148L132 121V98.5L123 73.5L106.5 44.5L78.5 21.5L53 1L27.5 35L20 54Z"
              stroke="black"
            />
          </svg>
        </div>
        <div id="35" className="absolute top-[67%] left-[67%]">
          <svg
            width="120"
            height="60"
            viewBox="0 0 189 97"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill="yellow"
              id="feet-path-35"
              d="M1 49.9991C9.33333 39.4991 28.1 18.2991 36.5 17.4991C42.7405 16.9048 49.3674 17.1935 51.1321 17.3813L69.5 1L119 28L145.5 44C159.5 54 187.6 74 188 74C188.4 74 173.833 84.6667 166.5 90C166.667 90.6667 161.8 92.6 141 95C120.2 97.4 92.3333 92.6667 81 90L36.5 70L1 49.9991Z"
              stroke="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Feet;
