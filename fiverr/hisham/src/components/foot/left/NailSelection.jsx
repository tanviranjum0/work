import React, { useContext, useEffect } from 'react'
import { StoreContext } from '../../../context/StoreContext';

const NailSelection = () => {
    const { nailShapesZones, handleNailShapeSelect } = useContext(StoreContext)
    useEffect(() => {
        const iterator = async () => {
            for (const id in nailShapesZones) {
                if (nailShapesZones[id] == 1) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.classList.add("opacity-60");
                        newPoint.setAttribute("fill", "#119920");
                    });
                } else if (nailShapesZones[id] == 0) {
                    let point = document.querySelectorAll(`#${id}`);
                    point.forEach((newPoint) => {
                        newPoint.setAttribute("fill", "white");
                        newPoint.classList.remove("opacity-60");
                    });
                }
            }
        };
        iterator();
    }, [nailShapesZones]);

    const handleClick = async (e) => {
        handleNailShapeSelect(e.target.getAttribute("id"));
    };
    const handleMouseEnter = (e) => {
        e.target.classList.add("opacity-20");
        e.target.setAttribute("stroke", "black");
    };
    const handleMouseLeave = (e) => {
        e.target.classList.add("opacity-20");
        e.target.setAttribute("stroke", "none");
    };
    return (
        <div className="nailShapes flex w-full -ml-24 h-24">
            <div className="relative top-[43.5%] left-[13%]">
                <svg width="121" height="12" viewBox="0 0 143 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        id='shapeone'
                        className='z-10 opacity-0'
                        onClick={handleClick}
                        strokeWidth={3}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        d="M141.5 1H1V14.5H141L141.5 1Z" fill="" />
                </svg>
            </div>
            <div className=" z-10 relative top-[37.6%] left-[14.2%]">
                <svg width="135" height="30" viewBox="0 0 170 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        id='shapetwo'
                        className='z-10 opacity-0'
                        onClick={handleClick}
                        strokeWidth={3}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        d="M11.5 38.5H1C1.16667 37.3333 1.7 34.6 2.5 33C3.3 31.4 6.5 27 8 25L15.5 18L33.5 9.5L44 5.5L68 1.5L79.5 1H98L112.5 3L126.5 6L139.5 10.5L152.5 17L160 23L165.5 30.5L168.5 37.5H157.5V36.5C156.333 34.3333 153 29.1 149 25.5C145 21.9 140.333 20 138.5 19.5C133.667 17.5 122.3 13.1 115.5 11.5C108.7 9.9 101.667 9.16667 99 9C92.1667 9 76.7 9.1 69.5 9.5C62.3 9.9 57.8333 11 56.5 11.5L47 13.5L38 16.5L29 20C26.5 21.6667 20.8 25.6 18 28C15.2 30.4 14.5 31.3333 14.5 31.5L13 35L11.5 38.5Z" fill="" />
                </svg>

            </div>
            <div className="relative z-10 top-[34.5%] left-[16.1%]">
                <svg width="110" height="35" viewBox="0 0 141 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        id='shapethree'
                        className='z-10 opacity-0'
                        onClick={handleClick}
                        strokeWidth={3}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        d="M2.5 37.0997L1 45.0997C1 41.0997 1.1 32.3996 1.5 29.5996C1.9 26.7996 3.33333 24.0996 4 23.0996L8 16.5996C10.3333 14.2663 15.9 8.99961 19.5 6.59961C24 3.59961 30 1.59968 32 1.09968C33.6 0.69968 83.6667 1.59968 108.5 2.09968L118 4.09968L123.5 7.59968L130.5 12.5997L135.5 19.0997L139.5 29.0997L140 44.0997L138.5 41.0997C137.833 38.7663 136.2 33.5997 135 31.5997C133.8 29.5997 132.833 27.7663 132.5 27.0997L128 22.5997L123.5 19.5997L118.5 16.5997L113 15.0997L107 14.0997H33.5L26.5 15.5997C23.5 16.7663 17 19.4997 15 21.0997C13 22.6997 9.5 26.433 8 28.0997L2.5 37.0997Z" fill="" />
                </svg>
            </div>
            <div className="relative  top-[21%] left-[18.2%]">
                <svg width="120" height="60" viewBox="0 0 150 77" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        id='shapefour'
                        className='z-10 opacity-0'
                        onClick={handleClick}
                        strokeWidth={3}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        d="M11.5 46V74.5L5 66.5L1 53.5V43.5L2.5 33.5L5.5 22.5L10 15.5L16 8.5L23.5 4.5L30 1.5L112.5 1L123 5L131.5 9.5L139 16L145.5 26.5L149 37L149.5 46L149 55L145 65.5L138.5 75L138 43L136 33L131.5 25.5L126 19L118.5 15L109 13L34.5 12.5L26 18L19 24.5L14.5 32L12 39L11.5 46Z" fill="#808080" stroke="black" />
                </svg>


            </div>
            <div className=" relative z-10 top-[21%] left-[20.2%]">
                <svg width="76" height="60" viewBox="0 0 96 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        id='shapefive'
                        className='z-10 opacity-0'
                        onClick={handleClick}
                        strokeWidth={3}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        d="M12.5 46.5V76.5L6 69L2 55.5L1 48L2 38.5L4 30L11.5 18L18.5 11.5L26 7L35 3L44 1L51 1.5L58 2.5L65.5 4L72.5 7.5L79.5 13L84.5 17.5L88 22.5L91.5 28.5L94 35.5L95 43.5V53.5L93 61.5L89.5 69L83.5 77V59L83 43.5L80.5 34L75.5 25L68 18.5L58.5 14C56.8333 13.3333 52.3 12 47.5 12C42.7 12 39.1667 13 38 13.5C35.8333 14.3333 30.7 16.6 27.5 19C24.3 21.4 22.1667 23.3333 21.5 24L16 30.5L13 38L12.5 46.5Z" fill="" />
                </svg>

            </div>
            <div className="relative  top-[14.5%] z-10 left-[22.3%]">
                <svg width="74" height="73" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        id='shapesix'
                        className='z-10 opacity-0'
                        onClick={handleClick}
                        strokeWidth={3}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        d="M22.5005 73.9995L37.5005 93.9995L25.5 89L18.5 84L6 71.5L2 57.5L1 48.5L2.5 39.5C3 36.8333 4.4 30.7 6 27.5C7.6 24.3 10 20.8333 11 19.5L17.5 12L29.5 5L36.5 2L49 1L56 2L63.5 3L79 11.5C81.8333 14 87.7 19.4 88.5 21C89.3 22.6 91.8333 26 93 27.5L96 36L97.5 44.5V56L95.5 64.5L88 77L76.5 87C72.5 88.6667 64 92.3 62 93.5C60 94.7 70.5 82.3333 76 76L81.5 67.5L85 60C85 54.6667 84.9 43.4 84.5 41C84.1 38.6 82.3333 35 81.5 33.5L76 26L69.5 19L59 13.9995C55.5 13.4995 47.2 12.6995 42 13.4995C36.8 14.2995 33.5 16.1662 32.5 16.9995L23.5 24.4995C20.5002 27.9995 14.2005 35.7995 13.0005 38.9995C11.8005 42.1995 12.5005 51.9995 13.0005 56.4995L16.0005 64.4995L22.5005 73.9995Z" fill="" />
                </svg>
            </div>

        </div>
    )
}

export default NailSelection
