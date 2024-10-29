import { FaAngleDown } from "react-icons/fa";
import { MdOutlineClearAll } from "react-icons/md";
import { VscSend } from "react-icons/vsc";
import { PiCellSignalFullFill } from "react-icons/pi";
import { motion } from "framer-motion";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { useState } from "react";
const MiddleSidebar = () => {
  const [channelShow, setChannelShow] = useState(true);
  const handleChannelShow = () => {
    document.getElementById("rotatingArrow").classList.toggle("-rotate-45");
    document.getElementById("rotatingArrow").classList.toggle("rotate-45");
    setChannelShow(!channelShow);
  };
  const [selectedChannel, setSelectedChannel] = useState("slackbox");

  const channels = [
    { name: "slackbox" },
    { name: "Improvement" },
    { name: "Culture-Club" },
    { name: "general" },
    { name: "slack-workflow" },
    { name: "product-feedback" },
    { name: "marketing" },
    { name: "Productivuty" },
  ];
  return (
    <div>
      <div className="h-12 select-none  shadow flex justify-between font-semibold p-3 text-2xl">
        <div className=" flex  items-center ">
          Slack <FaAngleDown className="" />{" "}
        </div>
        <MdOutlineClearAll className="self-end" />
      </div>
      <div className="px-3 mt-3 text-lg  items-center flex">
        <BiMessageRoundedDetail className="mx-2 -scale-x-100" />
        Threads
      </div>
      <div className="px-3 text-lg  items-center flex">
        <VscSend className="mx-2" />
        Drafs and sent
      </div>
      <div
        onClick={() => handleChannelShow()}
        className="px-6 mt-3 select-none text-md cursor-pointer items-center flex"
      >
        <PiCellSignalFullFill id="rotatingArrow" className="mx-2 rotate-45" />
        Channels
      </div>
      {channelShow && (
        <div className="flex flex-col ">
          {channels.map((channel, key) => {
            return (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.02 * `${key}`,
                  type: "tween",
                }}
                key={`${channel.name}-${key}`}
                className={`text-md rounded-lg px-5  mx-2 cursor-pointer hover:bg-[rgba(125,57,134,0.15)]  py-1 ${
                  selectedChannel == channel.name
                    ? "bg-[rgb(125,57,134)] text-gray-200"
                    : ""
                } `}
              >
                <span className="text-xl">#</span> {channel.name}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MiddleSidebar;
