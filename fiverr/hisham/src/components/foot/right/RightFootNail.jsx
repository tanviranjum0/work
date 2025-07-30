import { useContext, useEffect } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";

const FeetNail = () => {
    const { footNailZone, increaseNailPain } = useContext(StoreContext);
    useEffect(() => {
        const iterator = async () => {
            for (const id in footNailZone) {
                if (footNailZone[id] == 1) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.classList.add("opacity-60");
                        newPoint.setAttribute("fill", "#119920");
                    });
                } else if (footNailZone[id] == 2) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.setAttribute("fill", "yellow");
                    });
                } else if (footNailZone[id] == 3) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.setAttribute("fill", "orange");
                    });
                } else if (footNailZone[id] == 4) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.setAttribute("fill", "red");
                    });
                } else if (footNailZone[id] == 0) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.setAttribute("fill", "white");
                        newPoint.classList.remove("opacity-60");
                    });
                }
            }
        };
        iterator();
    }, [footNailZone]);

    const handleClick = async (e) => {
        increaseNailPain(e.target.getAttribute("id"));
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
            <div className="relative -scale-x-100 foot-nail border mt-10 bg-gray-400 h-[589px] w-[390px] p-5">
                <div id="nail-1" className="absolute top-[26%] left-[66.8%]">
                    <svg
                        width="27"
                        height="70"
                        viewBox="0 0 20 51"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootNail1"
                            d="M5 9.5L11 2L12.5 13.5V23V31L14.5 37.5L18.5 46.5L9 49L2.5 50L1 39.5V28.5L2 18L5 9.5Z"
                        />
                    </svg>
                </div>
                <div id="nail-2" className="absolute top-[36.5%] left-[68.5%]">
                    <svg
                        width="28"
                        height="22"
                        viewBox="0 0 23 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootNail2"
                            d="M10 2L1 4.5L2 8.5L4.5 11L7.5 13L14 14.5L15.5 13.5L18 10.5L21 6L22 2.5V1H17L10 2Z"
                        />
                    </svg>
                </div>
                <div id="nail-3" className="absolute top-[36.5%] left-[73%]">
                    <svg
                        width="60"
                        height="25"
                        viewBox="0 0 44 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            className="opacity-0"
                            fill="yellow"
                            id="rightFootNail3"
                            d="M7.5 3.5L2.5 11.5H2L5 13.5L10 15L17 16.5L25 16L31 14.5L38 11L43 8.5L42.5 7.5L40 6L38 4.5L35 2L32.5 1L31 1.5L28 3L24.5 4.5L20.5 5H17L13 4L9.5 3.5H7.5Z"
                        />
                    </svg>
                </div>
                <div id="nail-4" className="absolute top-[35.5%] left-[86%]">
                    <svg
                        width="32 "
                        height="20"
                        viewBox="0 0 25 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootNail4"
                            d="M7.5 3C3.5 3.4 1.5 6.5 1 8C1.83333 9 3.7 11.2 4.5 12C5.3 12.8 8.16667 13.6667 9.5 14L12.5 15C12.1667 15.1667 12.8 15.3 18 14.5C23.2 13.7 22.8333 13.1667 22 13L24.5 11V6.5L23.5 1L19 1.5C16.8333 1.83333 11.5 2.6 7.5 3Z"
                        />
                    </svg>
                </div>
                <div id="nail-5" className="absolute top-[25.5%] left-[86.5%]">
                    <svg
                        width="31"
                        height="61"
                        viewBox="0 0 23 45"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleClick}
                            fill="yellow"
                            className="opacity-0"
                            id="rightFootNail5"
                            d="M6.5 4L1 1V4L6.5 24.5L8.5 33.5C8.16667 36 7.7 41.4 8.5 43C9.3 44.6 10.1667 43.6667 10.5 43L16.5 42C18.5 41.8333 22.5 41.2 22.5 40C22.5 38.8 21.5 36.1667 21 35L17.5 24.5L15 16L12 9L6.5 4Z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default FeetNail;
