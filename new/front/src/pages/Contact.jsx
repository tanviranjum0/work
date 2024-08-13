import { Field, Label, Switch } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/moleculas/Footer";
export default function Contact() {
  return (
    <div>
      {" "}
      <div className=" contact-bg text-black px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">
            Contact sales
          </h2>
          <p className="mt-2 text-lg leading-8 ">Query, Feedback, Bug report</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.form
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
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-semibold leading-6 "
                >
                  First name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black text-black focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-semibold leading-6 "
                >
                  Last name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black text-black focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="block text-sm font-semibold leading-6 "
                >
                  Company
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="company"
                    id="company"
                    autoComplete="organization"
                    className="block w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black text-black focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 "
                >
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="block text-black w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-semibold leading-6 "
                >
                  Phone number
                </label>
                <div className="relative mt-2.5">
                  <input
                    type="number"
                    name="phone-number"
                    id="phone-number"
                    autoComplete="tel"
                    className="block w-full text-black rounded-md border-0 px-1 py-2 pl-20  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold leading-6 "
                >
                  Message
                </label>
                <div className="mt-2.5">
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    className="block w-full text-black rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-green-900 focus:ring-1 focus:ring-inset focus:ring-indigo-600  sm:leading-6"
                    defaultValue={""}
                  />
                </div>
              </div>
              <Field as="div" className="flex gap-x-4 sm:col-span-2">
                <Label className="text-sm leading-6 text-gray-300">
                  By continuing this, you agree to our{" "}
                  <a href="#" className="font-semibold text-indigo-600">
                    privacy&nbsp;policy
                  </a>
                </Label>
              </Field>
            </div>
            <div className="mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: "1.5deg" }}
                className="block text-white w-full rounded-md bg-red-400 px-3.5 py-2.5 text-center text-sm   shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send Feedback
              </motion.button>
            </div>
          </motion.form>
          <div className="pt-5 border-t-4 text-white">
            {" "}
            <Footer />
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
