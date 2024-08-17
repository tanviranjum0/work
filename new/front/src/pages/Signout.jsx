import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoIosWarning } from "react-icons/io";
import { Field, Label } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/moleculas/Footer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function SignOut() {
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [confirm, setConfirm] = useState(true);
  const handleConfirmChange = () => {
    const pass = document.getElementById("password").value;
    console.log(localStorage.getItem("auth"));
    setPassword(pass);
    setConfirm(!confirm);
  };
  const SignOutHandler = async () => {
    const res = await fetch(
      "https://ticket-back-production.up.railway.app/api/users/sign-out",
      {
        method: "POST",
        headers: {
          authorization: `${localStorage.getItem("auth")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );
    const data = await res.json();
    // localStorage.removeItem("auth");
    if (data.message == "Invalid credentials") {
      toast.error("Invalid credentials, Please try again");
      navigate("/signout");
    } else if (data.message == "Logout Successful") {
      localStorage.removeItem("auth");
      toast.success("Log Out Successful");
      navigate("/");
      window.location.reload();
    } else if (data.message == "Authorization Failed") {
      toast.error("Authorization Failed, Please try again");
      navigate("/signout");
    }
  };

  return (
    <div>
      {confirm ? (
        <div className=" contact-bg text-black px-6 py-12 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">
              Sign Out
            </h2>
            <p className="mt-2 text-lg leading-8 ">Please Login to RockGaan</p>
          </div>
          <AnimatePresence mode="sync">
            <motion.form
              key="login"
              initial={{
                opacity: 0,
              }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeIn",
                delay: 0.5,
              }}
              className="mx-auto py-5 mt-16 max-w-xl sm:mt-20"
            >
              <div className="">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold leading-6 "
                >
                  Confirm Your Password :
                </label>
                <div className="relative mt-2.5">
                  <input
                    type="text"
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    className="block w-full text-black rounded-md border-0 px-1 py-2 pl-5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-10">
                <motion.button
                  key="login2"
                  onClick={() => {
                    handleConfirmChange();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, rotate: "1.5deg" }}
                  className="block text-white w-full rounded-md bg-red-400 px-3.5 py-2.5 text-center text-sm   shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign Out
                </motion.button>
              </div>
            </motion.form>
            <div className="pt-5 border-t-4 text-white">
              {" "}
              <Footer />
            </div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="h-[90vh] bg-slate-400 relative w-full flex justify-center items-center">
          <div className="mx-auto flex flex-col items-center py-3 w-[80%] md:w-[60%] border bg-slate-200 rounded">
            <div className="text-6xl text-center text-red-600">
              <IoIosWarning />
            </div>
            <div className="text-2xl text-center py-3">
              Are you sure you want to Sign Out?
            </div>
            <div className="flex gap-5">
              {" "}
              <div
                onClick={() => {
                  SignOutHandler();
                }}
                className="text-md bg-red-600 text-white font-semibold hover:bg-red-700 hover:ring-black hover:ring-1 active:scale-95 px-4 py-3 rounded-lg my-3"
              >
                Yes, I'm sure
              </div>{" "}
              <div className="bg-slate-400 font-semibold hover:bg-slate-500 hover:ring-black hover:ring-1 active:scale-95  px-4 py-3 rounded my-3">
                No, cancel
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SignOut;
