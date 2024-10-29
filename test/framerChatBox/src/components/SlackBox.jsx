import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { useState } from "react";
import MessageForm from "./MessageForm";
import AiBox from "./AiBox";
import MainMessageBox from "./MainMessageBox";
import MiddleSidebar from "./MiddleSidebar";
import LeftSideBar from "./LeftSideBar";

const SlackBox = () => {
  // useEffect(() => {
  //   fetch(yourUrl)
  //     .then((res) => res.json())
  //     .then((data) => setMessages(data));
  // }, []);
  const [aiBoxOpened, setAiBoxOpened] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      name: "Acme Ai",
      message:
        "Hi Geeta, welcome to Acme Al. What would you like to search for?",
    },
  ]);
  const handleAiBoxOpened = () => {
    setAiBoxOpened(!aiBoxOpened);
  };

  let [messages, setMessages] = useState([]);

  const handleAiMessageTransection = async () => {
    const element = document.getElementById("aiupdatedMessageDiv");
    element.scrollTop = element.scrollHeight;
    const text = document.getElementById("aiText");
    if (text.value == "") {
      return;
    }

    // posting to server

    // fetch(backendUrlForAiMessageSending, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: "SenderName",
    //     img: "senderImageUrl",
    //     message: `${text.value}`,
    //     timestamp: `${new Date()}`,
    //   }),
    // });

    await setAiMessages((msg) => [
      ...msg,
      {
        name: "Tanvir",
        img: "/men.jpg",
        message: `${text.value}`,
        timestamp: `${new Date()}`,
      },
    ]);
    element.scrollTop = element.scrollHeight;
  };
  const handleMessageTransection = async () => {
    const element = document.getElementById("updatedMessageDiv");
    element.scrollTop = element.scrollHeight;
    const text = document.getElementById("mainText");
    if (text.value == "") {
      return;
    }

    // posting to server

    // fetch(backendUrlForMessageSending {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: "SenderName",
    //     img: "senderImageUrl",
    //     message: `${text.value}`,
    //     timestamp: `${new Date()}`,
    //   }),
    // });

    await setMessages((msg) => [
      ...msg,
      {
        name: "Tanvir",
        img: "/men.jpg",
        message: `${text.value}`,
        timestamp: `${new Date()}`,
      },
    ]);
    element.scrollTop = element.scrollHeight;
  };

  // selected=rgb(125,57,134)
  // inboxBg=rgb(67,19,73)
  // sideBg=rgba(67,19,73,.8)
  return (
    <div className="overflow-x-hidden">
      <Navbar handleAiBoxOpened={handleAiBoxOpened} />
      <div className="grid pr-2 py-2 h-[calc(100vh-2rem)] w-full rounded grid-cols-12 ">
        <div className="col-span-3 w-full h-full grid grid-cols-12">
          <div className="col-span-3 flex justify-center  text-[#EDEADE] w-full h-full">
            <LeftSideBar />
          </div>
          <div className="col-span-9 bg-gray-100 bg-opacity-70 w-full rounded-l-lg h-full">
            <MiddleSidebar />
          </div>
        </div>
        <motion.div
          key={"somethingforai"}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            type: "tween",
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="col-span-9 grid grid-cols-12 gap-3 grid-flow-col justify-between rounded-r-lg bg-gray-100 w-full h-full"
        >
          {aiBoxOpened ? (
            <>
              <div
                key={"mainMessageingBox"}
                id="mainMessageingBox"
                className="col-span-7"
              >
                <MainMessageBox messages={messages} />
                <div className="col-span-12 self-end mx-10 rounded-md ">
                  <MessageForm
                    handleMessageTransection={handleMessageTransection}
                  />
                </div>
              </div>
              <div id="aiBox" className="col-span-5">
                <AiBox
                  aiMessages={aiMessages}
                  handleAiMessageTransection={handleAiMessageTransection}
                  handleAiBoxOpened={handleAiBoxOpened}
                />
              </div>
            </>
          ) : (
            <div
              key={"mainMessageingBox2"}
              id="mainMessageingBox"
              className="col-span-12 "
            >
              <MainMessageBox messages={messages} />
              <div className="col-span-12 self-end mx-10 rounded-md ">
                <MessageForm
                  handleMessageTransection={handleMessageTransection}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SlackBox;
