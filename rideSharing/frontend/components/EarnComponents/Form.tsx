import React from "react";

const Form = () => {
  return (
    <div>
      <form className="max-w-sm mt-10 mx-auto">
        <div className="">
          <label
            htmlFor="email"
            className="block text-left  mb-2 text-sm font-medium text-gray-900"
          >
            First Name*
          </label>
          <input
            type="text"
            id="fname"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="John"
            required
          />
        </div>
        <div className="">
          <label
            htmlFor="last name"
            className="block text-left  mb-2 text-sm font-medium text-gray-900"
          >
            Last Name*
          </label>
          <input
            type="text"
            id="lname"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Doe"
            required
          />
        </div>
        <div className="">
          <label
            htmlFor="email"
            className="block text-left  mb-2 text-sm font-medium text-gray-900"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@gmail.com"
            required
          />
        </div>
        <input
          className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          name="phone "
          id="phoneNumer"
        />
        <div className="flex mt-2 items-start ">
          <div>
            <label
              htmlFor="email"
              className="block text-left  mb-2 text-sm font-medium text-gray-900"
            >
              Your email
            </label>
            <input
              id="terms"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 "
              required
            />
          </div>

          <label
            htmlFor="terms"
            className="ms-2 text-sm font-medium text-gray-900 "
          >
            I agree with the{" "}
            <a href="#" className="text-blue-600 hover:underline ">
              terms and conditions
            </a>
          </label>
        </div>
        <button
          type="submit"
          className="text-white mt-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          Register new account
        </button>
      </form>
    </div>
  );
};

export default Form;
