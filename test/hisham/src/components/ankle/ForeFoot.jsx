import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
const ForeFoot = () => {
  const { foreFootZones, setForeFootZones } = useContext(StoreContext);
  useEffect(() => {
    const iterator = async () => {
      for (const id in foreFootZones) {
        if (foreFootZones[id] == 1) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "#63e071");
          });
        } else if (foreFootZones[id] == 2) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "yellow");
          });
        } else if (foreFootZones[id] == 3) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "orange");
          });
        } else if (foreFootZones[id] == 4) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "red");
          });

        }
        else if (foreFootZones[id] == 0) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.setAttribute("fill", "white");
          });
        }
      }
    };
    iterator();
  }, [foreFootZones]);

  const handleClick = (e) => {
    const itemId = e.target.id;
    if (itemId.startsWith("valg")) {
      const id = itemId.slice(6, 7);
      console.log(`valgus${id}`);
      if (foreFootZones[itemId] == 4) {
        setForeFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (foreFootZones[`varus${id}`] != 0) {
          setForeFootZones((prev) => ({ ...prev, [`varus${id}`]: 0 }));
        }
        setForeFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId.startsWith("varu")) {
      const id = itemId.slice(5, 6);
      console.log(`varus${id}`);
      if (foreFootZones[itemId] == 4) {
        setForeFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (foreFootZones[`valgus${id}`] != 0) {
          setForeFootZones((prev) => ({ ...prev, [`valgus${id}`]: 0 }));
        }
        setForeFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId.startsWith("over")) {
      const id = itemId.slice(10, 11);
      console.log(`overriding${id}`);
      if (foreFootZones[itemId] == 4) {
        setForeFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (foreFootZones[`underriding${id}`] != 0) {
          setForeFootZones((prev) => ({ ...prev, [`underriding${id}`]: 0 }));
        }
        setForeFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId.startsWith("under")) {
      const id = itemId.slice(11, 12);
      console.log(`underriding${id}`);
      if (foreFootZones[itemId] == 4) {
        setForeFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (foreFootZones[`overriding${id}`] != 0) {
          setForeFootZones((prev) => ({ ...prev, [`overriding${id}`]: 0 }));
        }
        setForeFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId.startsWith("cock") || itemId.startsWith("claw")) {
      if (foreFootZones[e.target.id] == 4) {
        setForeFootZones((prev) => ({ ...prev, [e.target.id]: 0 }));
      } else {
        setForeFootZones((prev) => ({ ...prev, [e.target.id]: prev[e.target.id] + 1 }));
      }
    }

  }

  return (
    <div className="w-[90%] select-none text-2xl mx-auto grid md:grid-cols-12 md:w-[70%]">
      <div className="col-span-12 md:col-span-1">
        <div className="border-3 rounded-2xl flex justify-center items-center h-full w-full text-gray-500 p-1 mx-auto text-center ">
          Toes
        </div>
      </div>
      <div className="col-span-11 flex md:flex-col">
        <div className="flex border-3 flex-col md:flex-row rounded-md">
          <div className="md:-rotate-90 md:mx-10 rounded-2xl">5</div>
          <div className="flex select-none  -mt-8">
            <div>
              <span onClick={handleClick} id='varus5' className="top-10 left-2 text-2xl text-gray-600 relative">Varus</span>
              <svg width="74" height="47" viewBox="0 0 93 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  onClick={handleClick}
                  id='varus5' d="M1 16.5V41V44.5L1.5 46.5L2.5 48.5L4 50.5L5.5 52L7 53.5L8 54.5L9 55.5L10.5 56.5L11.5 57L14 58H78.5L81 57.5L82.5 57L84.5 55.5L86.5 54L88 53L90 50.5L91.5 48.5L92.5 46.5V44.5V43V13.5L91.5 11.5L90.5 9.5L88.5 7L87.5 6L85.5 4.5L84 3.5L82.5 2.5L81.5 2L79.5 1.5L77.5 1H75.5H16L14 1.5L12 2.5L10 3.5L8.5 4.5L7 5.5L5.5 7L4 8.5L3 10.5L2 12.5L1.5 14.5L1 16.5Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div >
              <span onClick={handleClick} id='valgus5' className="top-10 left-2 text-2xl text-gray-600 relative">Valgus</span>
              <svg width="87" height="48" viewBox="0 0 109 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='valgus5' d="M1 45V16V15L1.5 13.5L2.5 12L3.5 10.5L4.5 9L5.5 8L6.5 7L9.5 4.5L11.5 3L13.5 2L15.5 1H93.5L94.5 1.5L96.5 2L99.5 3.5L101.5 4.5L103.5 6.5L105.5 8.5L107 11L108 13L108.5 15V45L108 47.5L107 49.5L105.5 51.5L103.5 53.5L101.5 55.5L99 57L97 58L95 59H15L13.5 58.5L11.5 57.5L10 56.5L8.5 55.5L7 54L5.5 52.5L4 51L3 49L2 47L1 45Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='claw5' className="top-10 left-2 text-2xl text-gray-600 relative">Claw</span>
              <svg width="67" height="48" viewBox="0 0 84 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='claw5' d="M1 45V15L1.5 13L3 11L4.5 9C5 8.33333 6.2 6.8 7 6L8 5L9.5 4L11 3L12.5 2L15.0753 1H68L70 1.5L72.5 2.5L75 4L77.5 5.5L79.5 7.5L81 9.5L82.5 11.5L83.5 13.5V47L82 49L81 51L79 53L77 55L74 57L71 58.5H15.5L14 58L11.5 57L8.5 55L6 53L4 51L2.5 49L1.5 47L1 45Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='overriding5' className="top-10 left-2 text-2xl text-gray-600 relative">Overriding</span>
              <svg width="134" height="48" viewBox="0 0 168 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='overriding5' d="M1 44.3521V13.5L1.5 11.5L3 10L4.5 8L6 6L8 4L10 2.5L12 1H151.5L153.5 1.5L156.5 2L158 2.5L160 3.5L162 5L164 7.5L165 9L166.5 11L167.5 12.5V46L166.5 47.5L165.5 49L164.5 51L163 52.5L161 54L159 55.5L156.5 57L154 58H15L11.5 57L8.5 55L5.5 52.5L3.5 49.5L2 47L1 44.3521Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='underriding5' className="top-10 left-2 text-2xl text-gray-600 relative">Underriding</span>
              <svg width="150" height="48" viewBox="0 0 188 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='underriding5' d="M1 45.3848V13.5L1.5 12L2.5 10L4 8L6 6C6.83333 5.16667 8.8 3.3 10 2.5L11.5 1.5L13 1H175L176.5 1.5L178 2.5L180 4L182 6L184 8L185 9.5L186 11.5L187 13.5V42.5V46L185.5 49L183.5 51.5L181 54.5L178 56.5L175 58H13L11 57.5L9 56.5L8 55.5L7 54.5L6 53.5L5 52.5C4.66667 52.1667 3.8 51.1 3 49.5L2 47.5L1 45.3848Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='cockup5' className="top-10 left-2 text-2xl text-gray-600 relative">Cockup</span>
              <svg width="101" height="48" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='cockup5' d="M1 46.5V14.5L2.5 10.5C3.16667 9.83333 5.8 7.3 11 2.5C12.6 1.3 14 1 14.5 1H110.5L115 3.5L119 6.5C120.167 8.16667 122.7 11.9 123.5 13.5C124.3 15.1 124.833 16.5 125 17V44L122.5 49C121.167 51 117.8 55.5 115 57.5C112.2 59.5 110.833 60 110.5 60H21.5C19.3333 60 14.3 59.7 11.5 58.5C8.7 57.3 8.33333 57 8.5 57C7.66667 56.3333 5.7 54.6 4.5 53C3.3 51.4 2.33333 50 2 49.5L1 46.5Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex border-3 rounded-md flex-col md:flex-row ">
          <div className="md:-rotate-90 md:mx-10 rounded-2xl">4</div>
          <div className="flex select-none  -mt-8">
            <div>
              <span onClick={handleClick} id='varus4' className="top-10 left-2 text-2xl text-gray-600 relative">Varus</span>
              <svg width="74" height="47" viewBox="0 0 93 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  onClick={handleClick}
                  id='varus4' d="M1 16.5V41V44.5L1.5 46.5L2.5 48.5L4 50.5L5.5 52L7 53.5L8 54.5L9 55.5L10.5 56.5L11.5 57L14 58H78.5L81 57.5L82.5 57L84.5 55.5L86.5 54L88 53L90 50.5L91.5 48.5L92.5 46.5V44.5V43V13.5L91.5 11.5L90.5 9.5L88.5 7L87.5 6L85.5 4.5L84 3.5L82.5 2.5L81.5 2L79.5 1.5L77.5 1H75.5H16L14 1.5L12 2.5L10 3.5L8.5 4.5L7 5.5L5.5 7L4 8.5L3 10.5L2 12.5L1.5 14.5L1 16.5Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div >
              <span onClick={handleClick} id='valgus4' className="top-10 left-2 text-2xl text-gray-600 relative">Valgus</span>
              <svg width="87" height="48" viewBox="0 0 109 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='valgus4' d="M1 45V16V15L1.5 13.5L2.5 12L3.5 10.5L4.5 9L5.5 8L6.5 7L9.5 4.5L11.5 3L13.5 2L15.5 1H93.5L94.5 1.5L96.5 2L99.5 3.5L101.5 4.5L103.5 6.5L105.5 8.5L107 11L108 13L108.5 15V45L108 47.5L107 49.5L105.5 51.5L103.5 53.5L101.5 55.5L99 57L97 58L95 59H15L13.5 58.5L11.5 57.5L10 56.5L8.5 55.5L7 54L5.5 52.5L4 51L3 49L2 47L1 45Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='claw4' className="top-10 left-2 text-2xl text-gray-600 relative">Claw</span>
              <svg width="67" height="48" viewBox="0 0 84 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='claw4' d="M1 45V15L1.5 13L3 11L4.5 9C5 8.33333 6.2 6.8 7 6L8 5L9.5 4L11 3L12.5 2L15.0753 1H68L70 1.5L72.5 2.5L75 4L77.5 5.5L79.5 7.5L81 9.5L82.5 11.5L83.5 13.5V47L82 49L81 51L79 53L77 55L74 57L71 58.5H15.5L14 58L11.5 57L8.5 55L6 53L4 51L2.5 49L1.5 47L1 45Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='overriding4' className="top-10 left-2 text-2xl text-gray-600 relative">Overriding</span>
              <svg width="134" height="48" viewBox="0 0 168 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='overriding4' d="M1 44.3521V13.5L1.5 11.5L3 10L4.5 8L6 6L8 4L10 2.5L12 1H151.5L153.5 1.5L156.5 2L158 2.5L160 3.5L162 5L164 7.5L165 9L166.5 11L167.5 12.5V46L166.5 47.5L165.5 49L164.5 51L163 52.5L161 54L159 55.5L156.5 57L154 58H15L11.5 57L8.5 55L5.5 52.5L3.5 49.5L2 47L1 44.3521Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='underriding4' className="top-10 left-2 text-2xl text-gray-600 relative">Underriding</span>
              <svg width="150" height="48" viewBox="0 0 188 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='underriding4' d="M1 45.3848V13.5L1.5 12L2.5 10L4 8L6 6C6.83333 5.16667 8.8 3.3 10 2.5L11.5 1.5L13 1H175L176.5 1.5L178 2.5L180 4L182 6L184 8L185 9.5L186 11.5L187 13.5V42.5V46L185.5 49L183.5 51.5L181 54.5L178 56.5L175 58H13L11 57.5L9 56.5L8 55.5L7 54.5L6 53.5L5 52.5C4.66667 52.1667 3.8 51.1 3 49.5L2 47.5L1 45.3848Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='cockup4' className="top-10 left-2 text-2xl text-gray-600 relative">Cockup</span>
              <svg width="101" height="48" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='cockup4' d="M1 46.5V14.5L2.5 10.5C3.16667 9.83333 5.8 7.3 11 2.5C12.6 1.3 14 1 14.5 1H110.5L115 3.5L119 6.5C120.167 8.16667 122.7 11.9 123.5 13.5C124.3 15.1 124.833 16.5 125 17V44L122.5 49C121.167 51 117.8 55.5 115 57.5C112.2 59.5 110.833 60 110.5 60H21.5C19.3333 60 14.3 59.7 11.5 58.5C8.7 57.3 8.33333 57 8.5 57C7.66667 56.3333 5.7 54.6 4.5 53C3.3 51.4 2.33333 50 2 49.5L1 46.5Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex border-3 rounded-md flex-col md:flex-row ">
          <div className="md:-rotate-90 md:mx-10 rounded-2xl">3</div>
          <div className="flex select-none  -mt-8">
            <div>
              <span onClick={handleClick} id='varus3' className="top-10 left-2 text-2xl text-gray-600 relative">Varus</span>
              <svg width="74" height="47" viewBox="0 0 93 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  onClick={handleClick}
                  id='varus3' d="M1 16.5V41V44.5L1.5 46.5L2.5 48.5L4 50.5L5.5 52L7 53.5L8 54.5L9 55.5L10.5 56.5L11.5 57L14 58H78.5L81 57.5L82.5 57L84.5 55.5L86.5 54L88 53L90 50.5L91.5 48.5L92.5 46.5V44.5V43V13.5L91.5 11.5L90.5 9.5L88.5 7L87.5 6L85.5 4.5L84 3.5L82.5 2.5L81.5 2L79.5 1.5L77.5 1H75.5H16L14 1.5L12 2.5L10 3.5L8.5 4.5L7 5.5L5.5 7L4 8.5L3 10.5L2 12.5L1.5 14.5L1 16.5Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div >
              <span onClick={handleClick} id='valgus3' className="top-10 left-2 text-2xl text-gray-600 relative">Valgus</span>
              <svg width="87" height="48" viewBox="0 0 109 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='valgus3' d="M1 45V16V15L1.5 13.5L2.5 12L3.5 10.5L4.5 9L5.5 8L6.5 7L9.5 4.5L11.5 3L13.5 2L15.5 1H93.5L94.5 1.5L96.5 2L99.5 3.5L101.5 4.5L103.5 6.5L105.5 8.5L107 11L108 13L108.5 15V45L108 47.5L107 49.5L105.5 51.5L103.5 53.5L101.5 55.5L99 57L97 58L95 59H15L13.5 58.5L11.5 57.5L10 56.5L8.5 55.5L7 54L5.5 52.5L4 51L3 49L2 47L1 45Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='claw3' className="top-10 left-2 text-2xl text-gray-600 relative">Claw</span>
              <svg width="67" height="48" viewBox="0 0 84 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='claw3' d="M1 45V15L1.5 13L3 11L4.5 9C5 8.33333 6.2 6.8 7 6L8 5L9.5 4L11 3L12.5 2L15.0753 1H68L70 1.5L72.5 2.5L75 4L77.5 5.5L79.5 7.5L81 9.5L82.5 11.5L83.5 13.5V47L82 49L81 51L79 53L77 55L74 57L71 58.5H15.5L14 58L11.5 57L8.5 55L6 53L4 51L2.5 49L1.5 47L1 45Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='overriding3' className="top-10 left-2 text-2xl text-gray-600 relative">Overriding</span>
              <svg width="134" height="48" viewBox="0 0 168 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='overriding3' d="M1 44.3521V13.5L1.5 11.5L3 10L4.5 8L6 6L8 4L10 2.5L12 1H151.5L153.5 1.5L156.5 2L158 2.5L160 3.5L162 5L164 7.5L165 9L166.5 11L167.5 12.5V46L166.5 47.5L165.5 49L164.5 51L163 52.5L161 54L159 55.5L156.5 57L154 58H15L11.5 57L8.5 55L5.5 52.5L3.5 49.5L2 47L1 44.3521Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='underriding3' className="top-10 left-2 text-2xl text-gray-600 relative">Underriding</span>
              <svg width="150" height="48" viewBox="0 0 188 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='underriding3' d="M1 45.3848V13.5L1.5 12L2.5 10L4 8L6 6C6.83333 5.16667 8.8 3.3 10 2.5L11.5 1.5L13 1H175L176.5 1.5L178 2.5L180 4L182 6L184 8L185 9.5L186 11.5L187 13.5V42.5V46L185.5 49L183.5 51.5L181 54.5L178 56.5L175 58H13L11 57.5L9 56.5L8 55.5L7 54.5L6 53.5L5 52.5C4.66667 52.1667 3.8 51.1 3 49.5L2 47.5L1 45.3848Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='cockup3' className="top-10 left-2 text-2xl text-gray-600 relative">Cockup</span>
              <svg width="101" height="48" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='cockup3' d="M1 46.5V14.5L2.5 10.5C3.16667 9.83333 5.8 7.3 11 2.5C12.6 1.3 14 1 14.5 1H110.5L115 3.5L119 6.5C120.167 8.16667 122.7 11.9 123.5 13.5C124.3 15.1 124.833 16.5 125 17V44L122.5 49C121.167 51 117.8 55.5 115 57.5C112.2 59.5 110.833 60 110.5 60H21.5C19.3333 60 14.3 59.7 11.5 58.5C8.7 57.3 8.33333 57 8.5 57C7.66667 56.3333 5.7 54.6 4.5 53C3.3 51.4 2.33333 50 2 49.5L1 46.5Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex border-3 rounded-md flex-col md:flex-row ">
          <div className="md:-rotate-90 md:mx-10 rounded-2xl">2</div>
          <div className="flex select-none  -mt-8">
            <div>
              <span onClick={handleClick} id='varus2' className="top-10 left-2 text-2xl text-gray-600 relative">Varus</span>
              <svg width="74" height="47" viewBox="0 0 93 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  onClick={handleClick}
                  id='varus2' d="M1 16.5V41V44.5L1.5 46.5L2.5 48.5L4 50.5L5.5 52L7 53.5L8 54.5L9 55.5L10.5 56.5L11.5 57L14 58H78.5L81 57.5L82.5 57L84.5 55.5L86.5 54L88 53L90 50.5L91.5 48.5L92.5 46.5V44.5V43V13.5L91.5 11.5L90.5 9.5L88.5 7L87.5 6L85.5 4.5L84 3.5L82.5 2.5L81.5 2L79.5 1.5L77.5 1H75.5H16L14 1.5L12 2.5L10 3.5L8.5 4.5L7 5.5L5.5 7L4 8.5L3 10.5L2 12.5L1.5 14.5L1 16.5Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div >
              <span onClick={handleClick} id='valgus2' className="top-10 left-2 text-2xl text-gray-600 relative">Valgus</span>
              <svg width="87" height="48" viewBox="0 0 109 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='valgus2' d="M1 45V16V15L1.5 13.5L2.5 12L3.5 10.5L4.5 9L5.5 8L6.5 7L9.5 4.5L11.5 3L13.5 2L15.5 1H93.5L94.5 1.5L96.5 2L99.5 3.5L101.5 4.5L103.5 6.5L105.5 8.5L107 11L108 13L108.5 15V45L108 47.5L107 49.5L105.5 51.5L103.5 53.5L101.5 55.5L99 57L97 58L95 59H15L13.5 58.5L11.5 57.5L10 56.5L8.5 55.5L7 54L5.5 52.5L4 51L3 49L2 47L1 45Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='claw2' className="top-10 left-2 text-2xl text-gray-600 relative">Claw</span>
              <svg width="67" height="48" viewBox="0 0 84 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='claw2' d="M1 45V15L1.5 13L3 11L4.5 9C5 8.33333 6.2 6.8 7 6L8 5L9.5 4L11 3L12.5 2L15.0753 1H68L70 1.5L72.5 2.5L75 4L77.5 5.5L79.5 7.5L81 9.5L82.5 11.5L83.5 13.5V47L82 49L81 51L79 53L77 55L74 57L71 58.5H15.5L14 58L11.5 57L8.5 55L6 53L4 51L2.5 49L1.5 47L1 45Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='overriding2' className="top-10 left-2 text-2xl text-gray-600 relative">Overriding</span>
              <svg width="134" height="48" viewBox="0 0 168 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='overriding2' d="M1 44.3521V13.5L1.5 11.5L3 10L4.5 8L6 6L8 4L10 2.5L12 1H151.5L153.5 1.5L156.5 2L158 2.5L160 3.5L162 5L164 7.5L165 9L166.5 11L167.5 12.5V46L166.5 47.5L165.5 49L164.5 51L163 52.5L161 54L159 55.5L156.5 57L154 58H15L11.5 57L8.5 55L5.5 52.5L3.5 49.5L2 47L1 44.3521Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='underriding2' className="top-10 left-2 text-2xl text-gray-600 relative">Underriding</span>
              <svg width="150" height="48" viewBox="0 0 188 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='underriding2' d="M1 45.3848V13.5L1.5 12L2.5 10L4 8L6 6C6.83333 5.16667 8.8 3.3 10 2.5L11.5 1.5L13 1H175L176.5 1.5L178 2.5L180 4L182 6L184 8L185 9.5L186 11.5L187 13.5V42.5V46L185.5 49L183.5 51.5L181 54.5L178 56.5L175 58H13L11 57.5L9 56.5L8 55.5L7 54.5L6 53.5L5 52.5C4.66667 52.1667 3.8 51.1 3 49.5L2 47.5L1 45.3848Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='cockup2' className="top-10 left-2 text-2xl text-gray-600 relative">Cockup</span>
              <svg width="101" height="48" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='cockup2' d="M1 46.5V14.5L2.5 10.5C3.16667 9.83333 5.8 7.3 11 2.5C12.6 1.3 14 1 14.5 1H110.5L115 3.5L119 6.5C120.167 8.16667 122.7 11.9 123.5 13.5C124.3 15.1 124.833 16.5 125 17V44L122.5 49C121.167 51 117.8 55.5 115 57.5C112.2 59.5 110.833 60 110.5 60H21.5C19.3333 60 14.3 59.7 11.5 58.5C8.7 57.3 8.33333 57 8.5 57C7.66667 56.3333 5.7 54.6 4.5 53C3.3 51.4 2.33333 50 2 49.5L1 46.5Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex border-3 rounded-md flex-col md:flex-row ">
          <div className="md:-rotate-90 md:mx-10 rounded-2xl">1</div>
          <div className="flex select-none  -mt-8">
            <div>
              <span onClick={handleClick} id='varus1' className="top-10 left-2 text-2xl text-gray-600 relative">Varus</span>
              <svg width="74" height="47" viewBox="0 0 93 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  onClick={handleClick}
                  id='varus1' d="M1 16.5V41V44.5L1.5 46.5L2.5 48.5L4 50.5L5.5 52L7 53.5L8 54.5L9 55.5L10.5 56.5L11.5 57L14 58H78.5L81 57.5L82.5 57L84.5 55.5L86.5 54L88 53L90 50.5L91.5 48.5L92.5 46.5V44.5V43V13.5L91.5 11.5L90.5 9.5L88.5 7L87.5 6L85.5 4.5L84 3.5L82.5 2.5L81.5 2L79.5 1.5L77.5 1H75.5H16L14 1.5L12 2.5L10 3.5L8.5 4.5L7 5.5L5.5 7L4 8.5L3 10.5L2 12.5L1.5 14.5L1 16.5Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div >
              <span onClick={handleClick} id='valgus1' className="top-10 left-2 text-2xl text-gray-600 relative">Valgus</span>
              <svg width="87" height="48" viewBox="0 0 109 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='valgus1' d="M1 45V16V15L1.5 13.5L2.5 12L3.5 10.5L4.5 9L5.5 8L6.5 7L9.5 4.5L11.5 3L13.5 2L15.5 1H93.5L94.5 1.5L96.5 2L99.5 3.5L101.5 4.5L103.5 6.5L105.5 8.5L107 11L108 13L108.5 15V45L108 47.5L107 49.5L105.5 51.5L103.5 53.5L101.5 55.5L99 57L97 58L95 59H15L13.5 58.5L11.5 57.5L10 56.5L8.5 55.5L7 54L5.5 52.5L4 51L3 49L2 47L1 45Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='claw1' className="top-10 left-2 text-2xl text-gray-600 relative">Claw</span>
              <svg width="67" height="48" viewBox="0 0 84 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='claw1' d="M1 45V15L1.5 13L3 11L4.5 9C5 8.33333 6.2 6.8 7 6L8 5L9.5 4L11 3L12.5 2L15.0753 1H68L70 1.5L72.5 2.5L75 4L77.5 5.5L79.5 7.5L81 9.5L82.5 11.5L83.5 13.5V47L82 49L81 51L79 53L77 55L74 57L71 58.5H15.5L14 58L11.5 57L8.5 55L6 53L4 51L2.5 49L1.5 47L1 45Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='overriding1' className="top-10 left-2 text-2xl text-gray-600 relative">Overriding</span>
              <svg width="134" height="48" viewBox="0 0 168 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='overriding1' d="M1 44.3521V13.5L1.5 11.5L3 10L4.5 8L6 6L8 4L10 2.5L12 1H151.5L153.5 1.5L156.5 2L158 2.5L160 3.5L162 5L164 7.5L165 9L166.5 11L167.5 12.5V46L166.5 47.5L165.5 49L164.5 51L163 52.5L161 54L159 55.5L156.5 57L154 58H15L11.5 57L8.5 55L5.5 52.5L3.5 49.5L2 47L1 44.3521Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='underriding1' className="top-10 left-2 text-2xl text-gray-600 relative">Underriding</span>
              <svg width="150" height="48" viewBox="0 0 188 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='underriding1' d="M1 45.3848V13.5L1.5 12L2.5 10L4 8L6 6C6.83333 5.16667 8.8 3.3 10 2.5L11.5 1.5L13 1H175L176.5 1.5L178 2.5L180 4L182 6L184 8L185 9.5L186 11.5L187 13.5V42.5V46L185.5 49L183.5 51.5L181 54.5L178 56.5L175 58H13L11 57.5L9 56.5L8 55.5L7 54.5L6 53.5L5 52.5C4.66667 52.1667 3.8 51.1 3 49.5L2 47.5L1 45.3848Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
            <div>
              <span onClick={handleClick} id='cockup1' className="top-10 left-2 text-2xl text-gray-600 relative">Cockup</span>
              <svg width="101" height="48" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path onClick={handleClick} id='cockup1' d="M1 46.5V14.5L2.5 10.5C3.16667 9.83333 5.8 7.3 11 2.5C12.6 1.3 14 1 14.5 1H110.5L115 3.5L119 6.5C120.167 8.16667 122.7 11.9 123.5 13.5C124.3 15.1 124.833 16.5 125 17V44L122.5 49C121.167 51 117.8 55.5 115 57.5C112.2 59.5 110.833 60 110.5 60H21.5C19.3333 60 14.3 59.7 11.5 58.5C8.7 57.3 8.33333 57 8.5 57C7.66667 56.3333 5.7 54.6 4.5 53C3.3 51.4 2.33333 50 2 49.5L1 46.5Z" stroke="gray" strokeWidth={3} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForeFoot;
