import { FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { FaHeadphones } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa";

const MainMessageBox = ({ messages }) => {
  return (
    <AnimatePresence key={`mainmessageboxmotion2`} mode="wait">
      <motion.div
        id="messagesAll"
        key={`mainmessageboxmotion`}
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <div className="flex flex-col justify-between">
          <div className="h-12 flex scroll-smooth  justify-between font-semibold p-3 text-2xl shadow">
            <div className="flex pl-2 items-center">
              <FaLock className="mx-3" />
              slackbox
              <FaAngleDown className="mx-1" />
            </div>
            <div className="flex items-center justify-center">
              <div className="p-1 border flex">
                <img src="/men.jpg" alt="men" className="h-4 w-4" />
                <img
                  src="/men.jpg"
                  alt="men"
                  className="relative -left-1 h-4 w-4"
                />
                <img
                  src="/men.jpg"
                  alt="men"
                  className="h-4 -left-2 relative w-4"
                />
                <div className="text-sm">4</div>
              </div>
              <div className="mx-3 border flex">
                <FaHeadphones className=" border-r p-1" />
                <FaAngleDown className="font-extralight" />
              </div>
            </div>
          </div>
          <div className="p-5 h-fit col-span-12">
            <div
              id="updatedMessageDiv"
              className="min-h-[57vh]  overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:hidden"
            >
              {messages.map((message, key) => {
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
                      delay: 0.2,
                      type: "tween",
                    }}
                    key={`${message?.name}-${key}`}
                    className={`flex gap-2 items-start p-3`}
                  >
                    <img
                      src={`${message?.img}`}
                      alt="men"
                      className="h-10 w-10 rounded"
                    />
                    <div className="flex flex-col">
                      <div className="flex gap-3 ">
                        <div className="font-bold text-sm">{message.name}</div>
                        <div className="text-xs self-center text-gray-500">
                          {message?.timestamp?.slice(16, 21)}
                        </div>
                      </div>
                      <div className="text-sm">{message?.message}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MainMessageBox;
