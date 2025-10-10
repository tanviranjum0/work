"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
const Test3 = () => {
  const [activePage, setActivePage] = useState("one");
  return (
    <div>
      <AnimatePresence mode="wait">
        {activePage == "one" ? (
          <motion.div
            key={"one"}
            initial="initialState"
            animate="animateState"
            exit="exitState"
            transition={{
              duration: 0.75,
            }}
            variants={{
              initialState: {
                opacity: 0,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              },
              animateState: {
                opacity: 1,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              },
              exitState: {
                clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
              },
            }}
            className="h-[100vh] text-2xl bg-emerald-400 w-[100vw] flex justify-center items-center"
          >
            <div
              onClick={() => setActivePage("two")}
              className="flex p-3 bg-gray-500 cursor-pointer gap-3"
            >
              Hello
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={"two"}
            initial="initialState"
            animate="animateState"
            exit="exitState"
            transition={{
              duration: 0.75,
            }}
            variants={{
              initialState: {
                opacity: 0,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              },
              animateState: {
                opacity: 1,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              },
              exitState: {
                clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
              },
            }}
            className="h-[100vh] text-2xl bg-emerald-400 w-[100vw] flex justify-center items-center"
          >
            <div
              onClick={() => setActivePage("one")}
              className="flex p-3 bg-gray-500 cursor-pointer gap-3"
            >
              Nice
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Test3;
