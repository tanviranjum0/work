import { FaRegClock } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { CgDanger } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import AiMessageForm from "./AiMessageForm";

const AiBox = ({
  handleAiBoxOpened,
  handleAiMessageTransection,
  aiMessages,
}) => {
  return (
    <AnimatePresence key={"aichatbox"} initial="true" mode="wait">
      {" "}
      <motion.div
        key={"aichatbox2"}
        initial={{
          opacity: 0,
          x: "100%",
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        exit={{
          opacity: 0,
          x: "100%",
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        className="h-[93vh] rounded-r-md flex flex-col justify-between shadow-md w-full bg-gray-100"
      >
        <div className="ainav h-12 px-4 flex items-center justify-between border-b-1 border-white shadow-md">
          <div className="text-xl font-semibold">Acme Ai</div>
          <div className="flex  gap-3">
            <FaRegClock className="text-xl cursor-pointer" />
            <HiDotsVertical className="text-xl cursor-pointer" />
            <RxCross2
              onClick={() => handleAiBoxOpened()}
              className="text-xl cursor-pointer font-bold"
            />
          </div>
        </div>

        <div
          id="aiupdatedMessageDiv"
          className="max-h-[55vh] col-span-12 overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:hidden"
        >
          <div id="aiBoxDescription">
            <div className=" flex items-center px-10">
              <img src="/ai.jpg" alt="ai" className="h-20 rounded w-20" />
              <div className="text-xl pl-10 ">Acme Ai </div>
              <span className=" text-xs bg-zinc-300 rounded-sm ml-2">APP</span>
            </div>{" "}
            <div className="px-10 mt-3">
              Acme provides instant access to HR info, IT support, project
              updates, and more, ensuring you have the resources you need at
              your fingertips. Simplify your work with Acme Al.
            </div>
            <div className="px-10 text-[.9rem] items-center flex text-blue-400 mt-3">
              <CgDanger />
              How to use Acme Ai?
            </div>
          </div>
          {aiMessages.map((msg, key) => {
            return (
              <div key={`key-${key}-aiMessagesKeyPro`}>
                {" "}
                <motion.div
                  key={`key-${key}-aiMessages`}
                  initial={{
                    opacity: 0,
                    y: -20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1,
                    type: "tween",
                  }}
                  className={`flex gap-2 items-start p-3`}
                >
                  <img
                    src={"/ai.jpg"}
                    alt="men"
                    className="h-12 w-12 rounded"
                  />
                  <div className="flex flex-col">
                    <div className="flex gap-3 ">
                      <div className="font-bold text-sm">{msg?.name}</div>
                      <div className="text-sm text-gray-500">
                        {msg?.timestamp?.slice(16, 21)}
                      </div>
                    </div>
                    <div className="text-sm">{msg?.message}</div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
        <div className="mx-3 mb-8 ">
          {" "}
          <AiMessageForm
            handleAiMessageTransection={handleAiMessageTransection}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AiBox;
