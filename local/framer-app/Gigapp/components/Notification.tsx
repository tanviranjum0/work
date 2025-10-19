"use client";
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { set } from "mongoose";

const Path = (props: { props: React.SVGAttributes<SVGPathElement> }) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const CloseButton = ({ close }) => (
  <button
    onClick={close}
    className="absolute top-3.5 right-2.5  bg-white border-none"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path d="M 3 16.5 L 17 2.5" />
      <Path d="M 3 2.5 L 17 16.346" />
    </svg>
  </button>
);
const add = (
  setNotifications: React.Dispatch<React.SetStateAction<string[]>>,
  message: string
) => {
  setNotifications((prev) => [...prev, message]);
};
const Notification = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  const remove = (index: number) => {
    console.log("Removing index:", index);
    const newArr = notifications.filter((_, i) => i !== index);
    setNotifications(newArr);
  };
  return (
    <div className="h-[100vh] w-[100vw] flex flex-col">
      <ul className="fixed right-0 top-0  bottom-0 flex flex-col list-none justify-end">
        <AnimatePresence initial={false} mode="popLayout">
          {notifications?.map((id, index) => {
            // setTimeout(() => {
            //   setNotifications(remove(index));
            // }, 3000);
            return (
              <motion.li
                key={id + index}
                layout
                className="w-[300px] bg-white m-2.5 relative rounded-xl grow-0 shrink-0 basis-24"
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 1 } }}
              >
                <div id={`${id}`} className="p-5">
                  This is notification {id}
                </div>
                <CloseButton close={() => remove(index)} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <button
        className="outline-none appearance-none cursor-pointer fixed bottom-2.5 left-2.5 w-16 h-16 rounded-[50%] text-2xl border-none flex bg-black justify-center items-center"
        onClick={() =>
          add(setNotifications, `Notification ${notifications.length + 1}`)
        }
      >
        +
      </button>
    </div>
  );
};

export default Notification;

const MicroNotification = () => {
  return <div>MicroNotification</div>;
};
