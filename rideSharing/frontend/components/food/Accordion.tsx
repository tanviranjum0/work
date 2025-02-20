"use client";
import React, { useState } from "react";
import { motion } from "motion/react";

import { FaAngleDown } from "react-icons/fa";
const Accordion = () => {
  const [isRider, setIsRider] = useState(true);
  const [riderAccordion, setRiderAccordion] = useState<{
    one: boolean;
    two: boolean;
    three: boolean;
    four: boolean;
    five: boolean;
    six: boolean;
  }>({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
    six: false,
  });
  const [accordion, setAccordion] = React.useState<{
    one: boolean;
    two: boolean;
    three: boolean;
    four: boolean;
    five: boolean;
    six: boolean;
  }>({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
    six: false,
  });
  return (
    <div className="md:w-[80vw] w-[95vw]  mx-auto">
      <div className="text-3xl text-center font-semibold">
        Frequently Asked Questions
      </div>
      <div className="flex mx-auto justify-center my-5 gap-5 ">
        <div
          onClick={() => setIsRider(true)}
          className={`rounded-md font-semibold  px-3 py-2 transition-all duration-200 cursor-pointer hover:bg-yellow-50 border ${
            isRider ? "bg-yellow-100" : ""
          }`}
        >
          I&apos;m a FoodMan
        </div>
        <div
          onClick={() => setIsRider(false)}
          className={`rounded-md font-semibold  px-3 py-2 transition-all duration-200 cursor-pointer hover:bg-yellow-50 border ${
            !isRider ? "bg-yellow-100" : ""
          }`}
        >
          I&apos;m a Customer
        </div>
      </div>
      <div className="p-4">
        {isRider && (
          <div>
            <div
              onClick={() =>
                setRiderAccordion({
                  one: !riderAccordion.one,
                  two: false,
                  three: false,
                  four: false,
                  five: false,
                  six: false,
                })
              }
              className=" cursor-pointer shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between ">
                <div className="flex ">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    1
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    The ordered food is not available. What to do?
                  </div>
                </div>
                <div className={`${riderAccordion.one && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {riderAccordion.one && (
                <motion.div
                  initial={{
                    y: 20,
                  }}
                  animate={{
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 py-4 text-gray-700 text-lg"
                >
                  Please contact the customer about the issue and if there is
                  any item update/cancel issue, inform our support center.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setRiderAccordion({
                  one: false,
                  two: !riderAccordion.two,
                  three: false,
                  four: false,
                  five: false,
                  six: false,
                })
              }
              className=" cursor-pointer  shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between">
                <div className="flex">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    2
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    My customer number is unavailable. What should i do?
                  </div>
                </div>
                <div className={`${riderAccordion.two && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {riderAccordion.two && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  Please try to contact the customer and inform support as well
                  and the issue will be taken care of.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setRiderAccordion({
                  one: false,
                  two: false,
                  three: !riderAccordion.three,
                  four: false,
                  five: false,
                  six: false,
                })
              }
              className="cursor-pointer shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between">
                <div className="flex ">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    3
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    My customer cancelled the order. What should i do?
                  </div>
                </div>
                <div className={`${riderAccordion.three && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {riderAccordion.three && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  As customer cancelled the order please wait for your next
                  order and we hope this order will be hassle-free.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setRiderAccordion({
                  one: false,
                  two: false,
                  three: false,
                  four: !riderAccordion.four,
                  five: false,
                  six: false,
                })
              }
              className="cursor-pointer shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between">
                <div className="flex ">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    4
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    Restaurent is not available temporary.What should i do?
                  </div>
                </div>
                <div className={`${riderAccordion.four && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {riderAccordion.four && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  As the restaurant is temporarily unavailable, please inform
                  our support about your issue and it will be taken care of.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setRiderAccordion({
                  one: false,
                  two: false,
                  three: false,
                  four: false,
                  five: !riderAccordion.five,
                  six: false,
                })
              }
              className="cursor-pointer shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between">
                <div className="flex ">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    5
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    Customer wanted the food from from different restaurent.
                    Should i proceed?
                  </div>
                </div>
                <div className={`${riderAccordion.five && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {riderAccordion.five && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  As you know this is not our process to deliver food from a
                  different restaurant other than the ordered restaurant, please
                  inform our support and as per our policy, this order will not
                  proceed.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setRiderAccordion({
                  one: false,
                  two: false,
                  three: false,
                  four: false,
                  five: false,
                  six: !riderAccordion.six,
                })
              }
              className="cursor-pointer shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between">
                <div className="flex ">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    6
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    The delivery address is more than 3 km. Should i deliver
                  </div>
                </div>
                <div className={`${riderAccordion.six && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {riderAccordion.six && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  For such an instance, please inform our support team. The team
                  will then look into your location and verify it. If your
                  delivery location is 3 KM or less, then you will need to
                  continue with the order.
                </motion.div>
              )}
            </div>
          </div>
        )}
        {!isRider && (
          <div>
            <div
              onClick={() =>
                setAccordion({
                  one: !accordion.one,
                  two: false,
                  three: false,
                  four: false,
                  five: false,
                  six: false,
                })
              }
              className=" cursor-pointer shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between ">
                <div className="flex ">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    1
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    I got the wrong food. What should i do?
                  </div>
                </div>
                <div className={`${accordion.one && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {accordion.one && (
                <motion.div
                  initial={{
                    y: 20,
                  }}
                  animate={{
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 py-4 text-gray-700 text-lg"
                >
                  We’re extremely sorry for the inconvenience. Please report
                  this issue through our app with a photo of the food or you can
                  also immediately contact our support team with the helpline.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setAccordion({
                  one: false,
                  two: !accordion.two,
                  three: false,
                  four: false,
                  five: false,
                  six: false,
                })
              }
              className=" cursor-pointer  shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between">
                <div className="flex">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    2
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    My foodman's number is unreachable. What should i do?
                  </div>
                </div>
                <div className={`${accordion.two && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {accordion.two && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  We’re extremely sorry about the inconvenience. Please, inform
                  our support team and we will take actions accordingly to help
                  you.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setAccordion({
                  one: false,
                  two: false,
                  three: !accordion.three,
                  four: false,
                  five: false,
                  six: false,
                })
              }
              className="cursor-pointer shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between ">
                <div className="flex ">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    3
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    The foodman refused to take my order. What can i do?
                  </div>
                </div>
                <div className={`${accordion.three && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {accordion.three && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  Please inform our support at 09678100800 immediately and we
                  will take care of the issue.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setAccordion({
                  one: false,
                  two: false,
                  three: false,
                  four: !accordion.four,
                  five: false,
                  six: false,
                })
              }
              className="cursor-pointer shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between">
                <div className="flex ">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    4
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    My foodman cancelled my order. What should i do?
                  </div>
                </div>
                <div className={`${accordion.four && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {accordion.four && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  We’re extremely sorry for the inconvenience. Please, place
                  your order again from the same restaurant and your desired
                  food will be delivered to you by another nearby foodman.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setAccordion({
                  one: false,
                  two: false,
                  three: false,
                  four: false,
                  five: !accordion.five,
                  six: false,
                })
              }
              className="cursor-pointer shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between">
                <div className="flex ">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    5
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    I forgot to apply promo code on my food order. what can i do
                    now?
                  </div>
                </div>
                <div className={`${accordion.five && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {accordion.five && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  Since you’ve already placed an order, you will need to proceed
                  with the current order. Please remember to apply the promo on
                  your next order and you will have your food delivered with a
                  discount.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setAccordion({
                  one: false,
                  two: false,
                  three: false,
                  four: false,
                  five: false,
                  six: !accordion.six,
                })
              }
              className="cursor-pointer shadow-lg"
            >
              <div className="md:px-12 sm:px-8 px-2 mt-3 sm:py-4 py-2 md:py-8 flex items-center justify-between">
                <div className="flex ">
                  <div className="h-8 w-8  md:h-10 md:w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    6
                  </div>
                  <div className="sm:text-xl font-semibold md:text-2xl ml-5">
                    I want to order from a restaurent that is not in the app.
                    Possible?
                  </div>
                </div>
                <div className={`${accordion.five && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {accordion.five && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  According to our policy, you can only order from the
                  restaurants available on the app. So, it is not possible for
                  you to order from a restaurant that is not on our app.
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
