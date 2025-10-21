"use client";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { addNewNotification } from "./Notification";
import { base64ToImage, imageToBase64 } from "@/utils/base64toImage";
const Footer = () => {
  const [service, setService] = useState<string>("Consulting");
  const [budget, setBudget] = useState("0k");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const mainContainer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mainContainer,
    offset: ["start end", "end start"],
  });
  const margin = useTransform(scrollYProgress, [0, 1], [80, 160]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const name = document.getElementById("name") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const message = document.getElementById("message") as HTMLInputElement;
    const image = document.getElementById("dropzone-file") as HTMLInputElement;
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("service", service);
    formData.append("budget", budget);
    formData.append("email", email.value);
    formData.append("message", message.value);

    if (!name.value || !email.value || !message.value) {
      return addNewNotification({
        message: "Please fill all required fields.",
        type: "error",
      });
    }
    if (!/\S+@\S+\.\S+/.test(email.value)) {
      return addNewNotification({
        message: "Please enter a valid email address.",
        type: "error",
      });
    }
    if (!image.files[0]) {
      formData.append("isValidImage", "false");
    } else {
      formData.append("image", image.files[0]);
      formData.append("isValidImage", "true");
    }
    const apiCall = async () => {
      const res = await fetch("/api/message", {
        method: "POST",
        body: formData,
      });
      console.log(res);
      const data = await res.json();
      console.log(data);
    };
    apiCall();
    console.log(selectedFile);
  };
  return (
    <div className=" bg-image-footer">
      <div className="h-[85vh] text-white -z-10 box-border w-full  flex justify-center items-center">
        <motion.div
          ref={mainContainer}
          style={{
            margin,
          }}
          className="h-full w-full opacity-100 bg-linear-to-r/oklch from-teal-500 to-black rounded-4xl"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="px-20 py-10 flex flex-col h-[85vh] gap-20 justify-between">
              <div className="">
                <div className="text-5xl pb-10">Tell me about your project</div>
                <div className="flex flex-col gap-2">
                  <div className="text-xl gap-2 flex items-center">
                    <IoShieldCheckmarkSharp />
                    <span>I will respond you within 12 hours</span>
                  </div>
                  <div className="text-xl gap-2 flex items-center">
                    <IoShieldCheckmarkSharp />
                    <span>I will sign an NDA if requested</span>
                  </div>
                  <div className="text-xl gap-2 flex items-center">
                    <IoShieldCheckmarkSharp />
                    <span>Access to dedicated consultant specialist</span>
                  </div>
                </div>
              </div>
              <div className=" flex flex-col gap-5">
                <div
                  onClick={() =>
                    window.open(
                      "https://mail.google.com/mail/?view=cm&fs=1&to=roksanakhanamseo@gmail.com&su=Framer%20motion%20business%20discussion&body=Type%20your%20message%20here!",
                      "_blank"
                    )
                  }
                  className="my-2 underline cursor-pointer"
                >
                  tanviranjum010@gmail.com
                </div>
                <div className="text-xl">
                  Always busy and want to book an exact time to call?
                </div>
                <div
                  onClick={() =>
                    // addNewNotification({
                    //   message: "Booking feature coming soon!",
                    //   type: "info",
                    // })
                    base64ToImage(
                      "data:image/jpeg;base64,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",
                      "image/jpeg",
                      "image/jpg"
                    )
                  }
                  className="rounded-full select-none cursor-pointer w-52 text-center font-bold p-3 bg-cyan-800"
                >
                  Book a call for free
                </div>
              </div>
            </div>
            <div className="px-20 py-10 select-none flex flex-col h-[85vh] justify-between">
              <div className="">
                <div className="">
                  <div className="text-2xl">Service</div>
                  <div className="flex gap-2">
                    <span
                      onClick={() => setService("Consulting")}
                      className={`footerBtn py-1 px-1.5 ${
                        service == "Consulting" && "bg-lime-800"
                      }`}
                    >
                      Consulting
                    </span>
                    <span
                      onClick={() => setService("Website")}
                      className={`footerBtn py-1 px-1.5 ${
                        service == "Website" && "bg-lime-800"
                      }`}
                    >
                      Website
                    </span>
                    <span
                      onClick={() => setService("Animation")}
                      className={`footerBtn py-1 px-1.5 ${
                        service == "Animation" && "bg-lime-800"
                      }`}
                    >
                      Animation
                    </span>
                    <span
                      onClick={() => setService("Backend")}
                      className={`footerBtn py-1 px-1.5 ${
                        service == "Backend" && "bg-lime-800"
                      }`}
                    >
                      Backend
                    </span>
                  </div>
                </div>
                <div className="">
                  <div className="text-2xl">Budget</div>
                  <div className="flex gap-2">
                    <span
                      onClick={() => setBudget("0k")}
                      className={`footerBtn py-1 px-1.5 ${
                        budget == "0k" && "bg-lime-800"
                      }`}
                    >
                      Less than $10k
                    </span>
                    <span
                      onClick={() => setBudget("10k")}
                      className={`footerBtn py-1 px-1.5 ${
                        budget == "10k" && "bg-lime-800"
                      }`}
                    >
                      $10k to $50k
                    </span>
                    <span
                      onClick={() => setBudget("50k")}
                      className={`footerBtn py-1 px-1.5 ${
                        budget == "50k" && "bg-lime-800"
                      }`}
                    >
                      More than $50k
                    </span>
                  </div>
                </div>
              </div>
              <form autoComplete="on" className="mx-auto w-full">
                <div className="flex gap-3">
                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="name"
                      className="peer-focus:font-medium absolute text-sm   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-200 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Full Name
                    </label>
                  </div>
                  <div className="relative z-0 w-full group">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="email"
                      className="peer-focus:font-medium absolute text-sm   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-200 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Email
                    </label>
                  </div>
                </div>
                <div className="relative z-0 w-full mt-3 group">
                  <input
                    type="text"
                    name="message"
                    id="message"
                    className="block py-2.5 px-0 w-full  bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="message"
                    className="peer-focus:font-medium absolute text-sm   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-200 peer-focus:dark:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Message
                  </label>
                </div>
                <div className="flex flex-col ">
                  <div className="text-2xl my-3">Attach a file(optional)</div>
                  <div className="flex items-center mb-4 justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full  border-2 border-gray-100 rounded-lg cursor-pointer bg-gray-900 "
                    >
                      <div className="flex flex-col  items-center justify-center py-3">
                        <svg
                          className="w-4 h-4  text-gray-100"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="text-sm text-gray-300">
                          <span id="fileSelectStatus" className="font-semibold">
                            {selectedFile
                              ? selectedFile.name
                              : "Click to upload"}
                          </span>
                        </p>
                        <p className="text-xs text-gray-300">
                          PNG, JPG or JPEG (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        onChange={(e) => handleFileChange(e)}
                        id="dropzone-file"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <button
                  onClick={(e) => handleSubmit(e)}
                  className="rounded-full cursor-pointer min-w-max sm:w-full border-2  border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px]  hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Footer;
