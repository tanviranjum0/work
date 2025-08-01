import React from "react";

const page = () => {
  return (
    <div className="w-[90vw] select-none py-10 sm:w-[75vw] md:w-[60vw] mx-auto">
      <div className="text-center py-5 text-4xl">Contact Us</div>
      <div className="text-xl text-center text-gray-500">Send your message</div>
      <div className="">
        <label
          htmlFor="name"
          className="block text-left mb-2 text-sm font-medium text-gray-900"
        >
          Name*
        </label>
        <input
          type="text"
          id="Name"
          className="shadow-xs cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5"
          placeholder="John Doe"
        />
      </div>
      <div className="">
        <label
          htmlFor="email"
          className="block text-left mb-2 text-sm font-medium text-gray-900"
        >
          Email*
        </label>
        <input
          type="email"
          id="Email"
          className="shadow-xs cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5"
          placeholder="johndoe@gmail.com"
        />
      </div>
      <div className="">
        <label
          htmlFor="Phone Number"
          className="block text-left mb-2 text-sm font-medium text-gray-900"
        >
          Phone Number*
        </label>
        <input
          type="number"
          id="PhoneNumber"
          className="shadow-xs cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5"
          placeholder="01XXXXXXXXXX"
        />
      </div>
      <div className="">
        <label
          htmlFor="Message"
          className="block text-left mb-2 text-sm font-medium text-gray-900"
        >
          Message*
        </label>
        <textarea
          id="Message"
          className="shadow-xs cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5"
          placeholder="Message"
        />
      </div>
      <div className="px-3 rounded-md text-center cursor-pointer font-semibold text-lg transition-all duration-300 active:scale-95 my-4 py-2 bg-yellow-200 hover:bg-yellow-400">
        Send Message
      </div>
    </div>
  );
};

export default page;
