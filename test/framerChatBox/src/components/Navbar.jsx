import { FaArrowRight } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";

const Navbar = ({ handleAiBoxOpened }) => {
  return (
    <div className="flex justify-center select-none items-center">
      <div className="w-full text-white gap-4 flex justify-center items-center h-8">
        <FaArrowLeft className="cursor-pointer" />
        <FaArrowRight className="cursor-pointer" />
        <FaRegClock className="cursor-pointer" />
        <input
          type="text"
          placeholder="Search Slack..."
          className="w-[40vw] focus:outline-none px-4 items-center placeholder-current justify-center text-white flex bg-gray-100 bg-opacity-30 rounded-md h-7 mt-1"
        />
        <div
          onClick={() => handleAiBoxOpened()}
          className="flex items-center cursor-pointer justify-center"
        >
          <div className="flex items-center cursor-pointer justify-center p-[.05rem] border rounded">
            <img src="/ai.jpg" className="w-4 rounded-[.15rem] h-4" alt="" />
            <FaAngleDown className="text-sm" />
          </div>
        </div>
        <FaRegQuestionCircle className="cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
