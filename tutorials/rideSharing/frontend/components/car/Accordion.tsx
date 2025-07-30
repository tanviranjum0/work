"use client";
import React, { useState } from "react";
import { motion } from "motion/react";

import { FaAngleDown } from "react-icons/fa";
const Accordion = () => {
  const [isRider, setIsRider] = useState(true);
  const [riderAccordion, setRiderAccordion] = useState<{
    one: false;
    two: false;
    three: false;
  }>({
    one: false,
    two: false,
    three: false,
  });
  const [accordion, setAccordion] = React.useState<{
    one: boolean;
    two: boolean;
    three: boolean;
    four: boolean;
    five: boolean;
  }>({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
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
          I&apos;m a Rider
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
                    Why i did not get my quest/incentive ammount?
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
                  This might happen due to: Incorrect payment details / bounced
                  payments Disqualified due to fraud Insufficient completion
                  rate Oversight / back-end error
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setRiderAccordion({
                  one: false,
                  two: !riderAccordion.two,
                  three: false,
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
                    How to update my documents?
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
                  Dear Concern, Welcome to AutoLane. To update your document,
                  please take a clear picture (possibly scan copy) and send us
                  through any channels below: 1. Mail docs@AutoLane.com 2.
                  WhatsApp 01904488259 3. Viber 01904488259 4. Imo 01904488259
                  (Do not forget to mention your contact number that is
                  registered to AutoLane). Thank you for being with AutoLane!
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setRiderAccordion({
                  one: false,
                  two: false,
                  three: !riderAccordion.three,
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
                    Why my account is suspended? How to withdraw it?
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
                  Please call us at our helpline 09678100800 to know the
                  suspension reason and duration. You have to visit our Walking
                  in Support to withdraw your suspension.
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
                    I was overcharged. How can i get refund
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
                  Please report an issue through your user app following this
                  process: AutoLane App Profile History Report Issue I would
                  like a refund I was overcharged then write ride details
                  Submit. Or, you can mail us your complaint at
                  rides@AutoLane.com.
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
                    How to Report an Issue/Complain
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
                  If you have faced any inconvenience while using our service
                  then please report us through the AutoLane app so that we can
                  help you and take necessary steps. Reporting process: AutoLane
                  App Profile History Report Issue Select proper TagSubmit You
                  can also report us your issue through our helpline. Dhaka:
                  09678100800 Chittagong: 09678101101 Sylhet: 09678202202 Or you
                  can mail us your complaint at rides@AutoLane.com.
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
                    How can i get promo code
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
                  Welcome to AutoLane. You can get 50% discount on your first
                  bike ride by using your friends invite code. We send promo
                  code from time to time to our regular customers by SMS and app
                  notification. Stay connected with us and keep your app
                  updated. We hope you will get our future promo codes timely.
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
                    In which area i can get AutoLane service?
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
                  Currently, we are providing our services in Dhaka including
                  Narayanganj, Tongi, and Gazipur, Sylhet and Chittagong
                  metropolitan city area. But hopefully, we will be providing
                  our services in your area soon. Keep your eyes on our official
                  Facebook page for further information.
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
                    How many people can i ride in a car
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
                  It is requested to ride highest 4 people at a time in a car
                  ride.
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
