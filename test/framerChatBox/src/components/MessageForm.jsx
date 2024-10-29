import { MdOutlineFileUpload } from "react-icons/md";
import { BsCameraVideo } from "react-icons/bs";
import { PiTextAaBold } from "react-icons/pi";
import { FaMicrophone } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { LiaAtSolid } from "react-icons/lia";
import { IoMdSend } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
const MessageForm = ({ handleMessageTransection }) => {
  return (
    <div className="grid w-full border rounded-xl p-3">
      <textarea
        id="mainText"
        rows={2}
        placeholder="Enter your message"
        className="w-full bg-inherit focus:outline-none rounded-md p-2"
      />
      <div className="flex justify-between">
        {" "}
        <div className="col-span-12 text-gray-700">
          <div className="flex gap-2 justify-center item-center">
            <label htmlFor="fileInput">
              <MdOutlineFileUpload className="text-2xl" />
            </label>
            <input type="file" name="file" id="fileInput" className="hidden" />
            <PiTextAaBold className="text-2xl" />
            <MdOutlineEmojiEmotions className="text-2xl" />
            <LiaAtSolid className="text-2xl" />
            <div className="border-r mx-2 shadow-xl"></div>
            <BsCameraVideo className="text-2xl" />
            <FaMicrophone className="text-2xl" />
          </div>
        </div>
        <div className="self-end text-gray-500 flex place-self-end">
          <div className="text-xl flex">
            <IoMdSend onClick={() => handleMessageTransection()} />
            <div className="border-r mx-2 shadow-xl"></div>
            <FaChevronDown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
