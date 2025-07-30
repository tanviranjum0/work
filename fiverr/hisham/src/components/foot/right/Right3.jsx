import { useContext, useEffect } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
const Left3 = () => {
    const { rightFootZone, increaseFootPain } = useContext(StoreContext);
    useEffect(() => {
        const iterator = async () => {
            for (const id in rightFootZone) {
                if (rightFootZone[id] == 1) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.classList.add("opacity-60");
                        newPoint.setAttribute("fill", "#119920");
                    });
                } else if (rightFootZone[id] == 2) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.setAttribute("fill", "yellow");
                    });
                } else if (rightFootZone[id] == 3) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.setAttribute("fill", "orange");
                    });
                } else if (rightFootZone[id] == 4) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.setAttribute("fill", "red");
                    });
                } else if (rightFootZone[id] == 0) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.setAttribute("fill", "white");
                        newPoint.classList.remove("opacity-60");
                    });
                }
            }
        };
        iterator();
    }, [rightFootZone]);

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
            <div className="relative -scale-x-100 left3bg border mt-10 bg-white h-[589px] w-[390px] p-5">
                <div id="unknown1" className="absolute top-[0%] left-[30%]">
                    <svg
                        width="66"
                        height="123"
                        viewBox="0 0 77 141"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="unknown1"
                            d="M71.5 1H1L14.5 140.5H34L76 115.5L71.5 1Z"
                        />
                    </svg>
                </div>
                <div id="3" className="absolute z-30 top-0 left-[62%]">
                    <svg
                        width="76"
                        height="155"
                        viewBox="0 0 92 187"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath3"
                            d="M91 138L77.5 185.5L33 95L10.5 32.5L1 1H38C40 10.1667 46.1 35.4 54.5 63C62.9 90.6 68 103.5 69.5 106.5L77.5 122L91 138Z"
                        />
                    </svg>
                </div>
                <div id="17" className="absolute z-30 top-[4%] left-[47.5%] ">
                    <svg
                        width="50"
                        height="147"
                        viewBox="0 0 61 174"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath17"
                            d="M30 1L1 11C4 45.5 10 114.1 10 112.5C10 110.9 23.3333 136.167 30 149L37 163L56.5 172.5L60.5 144L46.5 69.5L30 1Z"
                        />
                    </svg>
                </div>
                <div id="18" className="absolute top-[0%] z-20 left-[51.5%]">
                    <svg
                        width="123"
                        height="240"
                        viewBox="0 0 145 283"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath18"
                            d="M1 1C1 2.6 32.6667 1.66667 48.5 1L77 86L102 142L127 188.5L144 215L129.5 229.5L114 256L88.5 281V268V256L84.5 241L77.5 229.5L67 224.5H57H44V159.5L32 98.5L12 34.5L1 1Z"
                        />
                    </svg>
                </div>
                <div id="16" className="absolute top-[17.6%] left-[39%]">
                    <svg
                        width="85"
                        height="119"
                        viewBox="0 0 101 141"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath16"
                            d="M42.5 1L1 23.5V70L29.5 104.5L71 139.5L99.5 104.5L57 45.5L42.5 1Z"
                        />
                    </svg>
                </div>
                <div id="6" className="absolute top-[21.5%] left-[33%]">
                    <svg
                        width="25"
                        height="65"
                        viewBox="0 0 27 69"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath6"
                            d="M26 3L4.5 1L1 68.5H23.5L26 3Z"
                        />
                    </svg>
                </div>
                <div id="7b" className="absolute top-[32%] left-[37%]">
                    <svg
                        width="65"
                        height="85"
                        viewBox="0 0 77 99"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath7b"
                            d="M5.5 48.5L1 69L25.5 87.5L41 98L63.5 59L75.5 38.5C72.1667 35.5 64.3 28.7 59.5 25.5C54.7 22.3 50.8333 21.1667 49.5 21L41 11L32.5 1L27.5 11C24 17.8333 15.6 33.5 10 41.5C4.4 49.5 4.66667 49.5 5.5 48.5Z"
                        />
                    </svg>
                </div>
                <div id="7g" className="absolute top-[42%] left-[33%]">
                    <svg
                        width="41"
                        height="53"
                        viewBox="0 0 48 63"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath7g"
                            d="M7 18.6131L1 30.6131C4.83333 32.7799 14.5 38.6133 22.5 44.6133C30.5 50.6133 34.1667 57.7799 35 60.6133L46.5 30.6131C46.6667 29.9465 45.8 27.2133 41 21.6133C36.2 16.0133 25.3333 8.61328 20.5 5.61328L12.5 1.11314C12.1667 0.613143 11 1.51314 9 9.11314C7 16.7131 6.83333 18.6131 7 18.6131Z"
                        />
                    </svg>
                </div>
                <div id="19" className="absolute z-20 top-[33%] left-[46%]">
                    <svg
                        width="96"
                        height="95"
                        viewBox="0 0 113 112"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath19"
                            d="M36.5 36.3834L1 94.3834L33.5 111.384L60 92.3838L103 63.8838L109 58.8838L111.5 48.8838C111.667 44.717 111.4 34.2835 109 25.8838C106.6 17.4841 106.667 18.7172 107 20.3838L103 13.8838L99.5 8.88379C97.8333 7.21701 93.1 3.48344 87.5 1.88344C81.9 0.283443 79.8333 1.21678 79.5 1.88344H68.5L64.5 3.88344L36.5 36.3834Z"
                        />
                    </svg>
                </div>
                <div id="20a" className="absolute top-[46.5%] left-[36.5%]">
                    <svg
                        width="58"
                        height="92"
                        viewBox="0 0 68 108"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath20a"
                            d="M8.5 60L1 78.5L10.5 86C17.1667 92.6667 30.5 106.1 30.5 106.5C30.5 106.9 31.5 105.667 32 105L38.5 78.5L50 48L66.5 17C57 11.6667 37.6 1 36 1C34.4 1 30.3333 11.6667 28.5 17L23 33L16 48L8.5 60Z"
                        />
                    </svg>
                </div>
                <div id="20b" className="absolute top-[58%] left-[28%]">
                    <svg
                        width="58"
                        height="69"
                        viewBox="0 0 69 81"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1.15622 61C0.356222 59.4 2.82289 43.6667 4.15622 36L7.15625 32L17.6562 23.5L30.1562 10C31.1562 7 33.8563 1 36.6562 1C39.4562 1 58.4896 17.6667 67.6562 26V30.5C63.1562 39.5 52.6562 59 46.6562 65C40.6562 71 30.8229 77.5 26.6562 80C22.4896 79.1667 13.5562 77.2 11.1562 76C8.15625 74.5 2.15622 63 1.15622 61Z"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath20b"
                        />
                    </svg>
                </div>
                <div id="2" className="absolute top-[20.5%] left-[79.3%]">
                    <svg
                        width="61"
                        height="76"
                        viewBox="0 0 72 91"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath2"
                            d="M14.5 2L1 47L16.5 69L26 84.5L37.5 90.5H47.5L61.5 88L71 82.5L67 65L58.5 49.5L40 28L24 14.5L14.5 2Z"
                        />
                    </svg>
                </div>
                <div id="1" className="absolute top-[33%] left-[75%]">
                    <svg
                        width="73"
                        height="75"
                        viewBox="0 0 86 88"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath1"
                            d="M1 44V80.5L7.5 87.5H13L42.5 66.5L67.5 44L79 30L85 10V1L71.5 10L56 12.5L42.5 6.5L20.5 8L4 33.5L1 44Z"
                        />
                    </svg>
                </div>
                <div id="24" className="absolute top-[40.5%] left-[43%]">
                    <svg
                        width="122"
                        height="147"
                        viewBox="0 0 144 173"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath24"
                            d="M116 19.5L140 1L142.5 49L115.5 61.5L78 80.5L54.5 104.5L50 108.5L39.5 154.5L35 165L1 171.5L2 160.5L10.5 134L27.5 89.5L41 69L64 52L116 19.5Z"
                        />
                    </svg>
                </div>
                <div id="21" className="absolute top-[65.5%] left-[31%]">
                    <svg
                        width="65"
                        height="46"
                        viewBox="0 0 77 54"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath21"
                            d="M35.2954 19.5138C38.8954 17.5138 44.1287 7.3471 46.2954 2.51377C57.2952 1.01377 78.4949 -0.68623 75.2949 4.51377C72.0949 9.71377 67.9616 18.0138 66.2949 21.5138L57.7949 26.0138L44.2949 34.5138C40.6283 37.8471 31.6949 45.3138 25.2949 48.5138C18.8949 51.7138 13.2949 52.5138 11.2949 52.5138L1.29538 50.0138C0.462048 49.5138 0.895381 47.0138 9.29538 41.0138C19.7954 33.5138 30.7954 22.0138 35.2954 19.5138Z"
                        />
                    </svg>
                </div>
                <div id="15" className="absolute z-20 top-[66%] left-[16.5%]">
                    <svg
                        width="53"
                        height="59"
                        viewBox="0 0 63 70"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath15"
                            d="M1 55V61.5L5.5 66L14.5 69H22.5L31 66L36 63.5L41.5 55H52L62 56.5L59 44.5L54.5 35L52 21V8L50 1L40 9L31 16.5L22.5 25L16 33L10 41L4 47.5L1 55Z"
                        />
                    </svg>
                </div>
                <div id="14" className="absolute top-[65.5%] left-[8.5%]">
                    <svg
                        width="70"
                        height="49"
                        viewBox="0 0 89 61"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath14"
                            d="M61.5 29.5L88.5 1L12.5 27.5L7 33.5L1 48L7 58.5L20 60.5L38 58.5L50.5 37L61.5 29.5Z"
                        />
                    </svg>
                </div>
                <div id="13" className="absolute z-10 top-[64.7%] left-[4.5%]">
                    <svg
                        width="90"
                        height="40"
                        viewBox="0 0 106 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath13"
                            d="M22.5 42.5L28.5 32L40 22C46.1667 20.3333 59.3 16.7 62.5 15.5C65.7 14.3 79.8333 9.33333 86.5 7C93.1667 5 106.2 1 105 1H88L65.5 5L28.5 14L11 20.5L3.5 23.5L1 32L3.5 42.5L8.5 47.5H17L22.5 42.5Z"
                        />
                    </svg>
                </div>
                <div id="12" className="absolute z-10 top-[61.7%] left-[4.5%]">
                    <svg
                        width="90"
                        height="35"
                        viewBox="0 0 106 41"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath12"
                            d="M10.5 29L2 40L12.5 37.5L33.5 30.5L57 23L78 21L93.5 19L105 21L103.5 1L84 9.5L66.5 15L54 16.5L39 19L24.5 23L10.5 29Z"
                        />
                    </svg>
                </div>
                <div id="11" className="absolute z-20 top-[59%] left-[8%]">
                    <svg
                        width="73"
                        height="31"
                        viewBox="0 0 86 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootpath11"
                            d="M1 26.5L3 36L14 33H32L41.5 28L56.5 26.5L81 18L84.5 1L59.5 9L47 11.5L38.5 13.5L14 11.5L6.5 18L1 26.5Z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Left3;
