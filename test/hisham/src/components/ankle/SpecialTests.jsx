import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";

const SpecialTests = () => {
  const { increaseSpecialTestsZones, specialTestsZones } =
    useContext(StoreContext);
  useEffect(() => {
    const iterator = async () => {
      for (const id in specialTestsZones) {
        if (specialTestsZones[id] == 1) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.add("bg-green-500");
          });
        } else if (specialTestsZones[id] == 2) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.remove("bg-green-500");
            newPoint.classList.add("bg-yellow-500");
          });
        } else if (specialTestsZones[id] == 3) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.remove("bg-yellow-500");
            newPoint.classList.add("bg-orange-500");

          });
        } else if (specialTestsZones[id] == 4) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.remove("bg-orange-500");
            newPoint.classList.add("bg-red-500");

          });
        } else if (specialTestsZones[id] == 0) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.remove("bg-red-500");
          });
        }
      }
    };
    iterator();
  }, [specialTestsZones]);

  const handleClick = async (e) => {
    increaseSpecialTestsZones(e.target.getAttribute("id"));
  };
  const handleMouseEnter = (e) => {
    e.target.classList.add("opacity-80");
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove("opacity-80");
  };
  return (
    <div className="w-[90%] select-none text-2xl mx-auto grid grid-cols-4 md:grid-cols-10 md:w-[70%]">
      <div className="col-span-4">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          id="Silverskiold"
          className="border-3 px-2 py-1  cursor-pointer  text-center rounded-2xl"
        >
          Silverskiold
        </div>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          id="AnteriorDrawer"
          className="border-3 px-2 py-1  cursor-pointer  text-center rounded-2xl"
        >
          Anterior Drawer
        </div>
        <div className="grid grid-cols-2">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="PosteriorImpingement"
            className="text-center  cursor-pointer  rounded-3xl p-1 border-4"
          >
            Posterior impingement
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="AnteriorImpingement"
            className="text-center  cursor-pointer  rounded-3xl p-1 border-4"
          >
            Anterior Impingement
          </div>
        </div>
      </div>
      <div className="col-span-2 flex">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          id="Unstable1stTMT"
          className="rounded-3xl px-3  cursor-pointer  py-1 self-end border-3 text-center"
        >
          Unstable 1st TMT
        </div>
      </div>
      <div className="col-span-4 flex">
        <div className="self-end">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="Webspacetenderness23"
            className="border-3 px-2 py-1  cursor-pointer  text-center rounded-2xl"
          >
            2/3 Webspace tenderness
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="Webspacetenderness34"
            className="border-3 px-2 py-1 cursor-pointer  text-center rounded-2xl"
          >
            3/4 Webspace tenderness
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialTests;
