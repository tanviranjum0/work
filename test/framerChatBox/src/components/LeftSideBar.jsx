import { HiHome } from "react-icons/hi";
import { CiBookmark } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { GoBookmark } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { PiChatsCircle } from "react-icons/pi";
import { useState } from "react";
import { CiBellOn } from "react-icons/ci";
const LeftSideBar = () => {
  const [selectedTab, setSelectedTab] = useState("Home");
  const handleTabSelection = (tabName) => {
    setSelectedTab(tabName);
  };
  return (
    <div>
      <div className="relative gap-4 text-sm flex h-full mx-auto items-center justify-between flex-col">
        <div className="flex flex-col justify-center items-center mx-auto w-full">
          <img src="/slack.png" alt="logo" className="h-12 w-12" />
          <div className="flex mt-5 p-2  rounded-md  flex-col">
            <div
              id="Home"
              onClick={() => handleTabSelection("Home")}
              className={` hover:bg-[rgba(239,225,245,0.25)] ${
                selectedTab == "Home" ? "bg-[rgba(239,225,245,0.25)]" : ""
              }  flex justify-center items-center rounded-md  p-1 transition-all duration-100`}
            >
              <HiHome className="text-2xl " />
            </div>
            <div className=" text-sm">Home</div>
          </div>

          <div className="flex flex-col">
            <div
              id="DMs"
              onClick={() => handleTabSelection("DMs")}
              className={`hover:bg-[rgba(239,225,245,0.25)] rounded-md flex justify-center items-center p-1 transition-all  ${
                selectedTab == "DMs" ? "bg-[rgba(239,225,245,0.25)]" : ""
              }`}
            >
              <PiChatsCircle className="text-2xl  rounded-md " />
            </div>
            <div className=" text-sm">DMs</div>
          </div>

          <div className="flex mb-2 flex-col">
            <div
              id="Activity"
              onClick={() => handleTabSelection("Activity")}
              className={`${
                selectedTab == "Activity" ? "bg-[rgba(239,225,245,0.25)]" : ""
              } hover:bg-[rgba(239,225,245,0.25)]  rounded-md flex justify-center items-center p-1 transition-all `}
            >
              <CiBellOn className=" text-2xl  rounded-md " />
            </div>
            <div className="  text-sm">Activity</div>
          </div>

          <div className="flex flex-col">
            <div
              onClick={() => handleTabSelection("Later")}
              id="Later"
              className={` ${
                selectedTab == "Later" ? "bg-[rgba(239,225,245,0.25)]" : ""
              } hover:bg-[rgba(239,225,245,0.25)] rounded-md flex justify-center items-center p-1 transition-all `}
            >
              <GoBookmark className="text-xl rounded-md font-light" />
            </div>
            <div className=" text-sm">Later</div>
          </div>

          <div className="flex flex-col">
            <div
              id="More"
              onClick={() => handleTabSelection("More")}
              className={`${
                selectedTab == "More" ? "bg-[rgba(239,225,245,0.25)]" : ""
              } hover:bg-[rgba(239,225,245,0.25)]  rounded-md flex justify-center items-center p-1 transition-all `}
            >
              <BsThreeDots className="text-2xl  rounded-md " />
            </div>
            <div className="text-sm">More</div>
          </div>
        </div>
        <div className="flex gap-3 justify-center items-center flex-col">
          <div className="rounded-full p-2 font-extralight text-2xl  bg-[rgba(239,225,245,0.25)]">
            <GoPlus className="font-light" />
          </div>
          <div className="h-8 w-8">
            <img className="h-8 w-8 rounded" src="/men.jpg" alt="image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
