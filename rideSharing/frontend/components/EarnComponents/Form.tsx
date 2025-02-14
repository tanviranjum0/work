/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { FormContext } from "../context/FormContext";

const Form: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { formData, setFormData } = useContext(FormContext);

  const router = useRouter();

  const [formError, setFormError] = useState("");

  const handleRedirectToForm = async () => {
    setFormError("");
    if (params.slug == "motorcycle") {
      if (
        formData.bikeRider == false &&
        formData.foodDelivery == false &&
        formData.parcelDelivery == false
      ) {
        setFormError("Please select at least one service");
        return;
      }
    }
    if (params.slug == "cycle") {
      if (
        formData.cycleFoodDelivery == false &&
        formData.cycleParcelDelivery == false
      ) {
        setFormError("Please select at least one service");
        return;
      }
    }
    if (params.slug == "car") {
      if (formData.autoLaneCar == false) {
        setFormError("Please select at least one service");
        return;
      }
    }
    if (formData.email == "") {
      setFormError("Please provide your email address");
      return;
    }
    if (formData.firstName == "" || formData.lastName == "") {
      setFormError("Please provide your first and last name");
      return;
    }
    if (formData.phone == "" || formData.state == "") {
      setFormError("Please provide your phone number and state correctly");
      return;
    }
    {
      await setFormData({ ...formData, vehicleType: params.slug });
      localStorage.setItem("formData", formData);
      router.push(`/earn/${params.slug}/form`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.id == "bikeRider" ||
      e.target.id == "foodDelivery" ||
      e.target.id == "parcelDelivery" ||
      e.target.id == "autoLaneCar" ||
      e.target.id == "cycleFoodDelivery" ||
      e.target.id == "cyclePercelDelivery"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  let earning;

  if (params?.slug == "motorcycle") {
    earning = 3000;
  } else if (params?.slug == "car") {
    earning = 5000;
  } else if (params?.slug == "cycle") {
    earning = 2000;
  }
  return (
    <div>
      <form className="w-full mt-5 sm:mt-10 md:mt-20  mx-auto">
        <div className="">
          <label
            htmlFor="first name"
            className="block text-left mb-2 text-sm font-medium text-gray-900"
          >
            First Name*
          </label>
          <input
            onChange={handleChange}
            type="text"
            id="firstName"
            className="shadow-xs cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5"
            placeholder="John"
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
            onChange={handleChange}
            type="text"
            id="lastName"
            className="shadow-xs cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5"
            placeholder="Doe"
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
            onChange={handleChange}
            type="email"
            id="email"
            className="shadow-xs cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5"
            placeholder="name@gmail.com"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-left  mb-2 text-sm font-medium text-gray-900"
          >
            Your Phone
          </label>
          <div className="flex">
            <div className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-l-lg  focus:border-blue-500  p-2.5">
              +1
            </div>

            <input
              onChange={handleChange}
              className="shadow-xs cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg  appearance-none m-0  focus:border-blue-500 pl-5 block w-full p-2.5"
              type="number"
              placeholder="123-456-5678"
              name="phone"
              id="phone"
            />
          </div>
          <div className=" mx-auto">
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-medium text-left"
            >
              Select an State
            </label>
            <select
              onChange={(e) => handleChange(e)}
              id="state"
              className="bg-gray-100 cursor-pointer border  text-gray-900 text-sm rounded-lg   w-full p-2.5 "
            >
              <option value="none">--Select a State--</option>
              <option value="AL" className="cursor-pointer">
                Alabama
              </option>
              <option value="AK" className="cursor-pointer">
                Alaska
              </option>
              <option value="AZ" className="cursor-pointer">
                Arizona
              </option>
              <option value="AR" className="cursor-pointer">
                Arkansas
              </option>
              <option value="CA" className="cursor-pointer">
                California
              </option>
              <option value="CO" className="cursor-pointer">
                Colorado
              </option>
              <option value="CT" className="cursor-pointer">
                Connecticut
              </option>
              <option value="DE" className="cursor-pointer">
                Delaware
              </option>
              <option value="FL" className="cursor-pointer">
                Florida
              </option>
              <option value="GA" className="cursor-pointer">
                Georgia
              </option>
              <option value="HI" className="cursor-pointer">
                Hawaii
              </option>
              <option value="ID" className="cursor-pointer">
                Idaho
              </option>
              <option value="IL" className="cursor-pointer">
                Illinois
              </option>
              <option value="IN" className="cursor-pointer">
                Indiana
              </option>
              <option value="IA" className="cursor-pointer">
                Iowa
              </option>
              <option value="KS" className="cursor-pointer">
                Kansas
              </option>
              <option value="KY" className="cursor-pointer">
                Kentucky
              </option>
              <option value="LA" className="cursor-pointer">
                Louisiana
              </option>
              <option value="ME" className="cursor-pointer">
                Maine
              </option>
              <option value="MD" className="cursor-pointer">
                Maryland
              </option>
              <option value="MA" className="cursor-pointer">
                Massachusetts
              </option>
              <option value="MI" className="cursor-pointer">
                Michigan
              </option>
              <option value="MN" className="cursor-pointer">
                Minnesota
              </option>
              <option value="MS" className="cursor-pointer">
                Mississippi
              </option>
              <option value="MO" className="cursor-pointer">
                Missouri
              </option>
              <option value="MT" className="cursor-pointer">
                Montana
              </option>
              <option value="NE" className="cursor-pointer">
                Nebraska
              </option>
              <option value="NV" className="cursor-pointer">
                Nevada
              </option>
              <option value="NH" className="cursor-pointer">
                New Hampshire
              </option>
              <option value="NJ" className="cursor-pointer">
                New Jersey
              </option>
              <option value="NM" className="cursor-pointer">
                New Mexico
              </option>
              <option value="NY" className="cursor-pointer">
                New York
              </option>
              <option value="NC" className="cursor-pointer">
                North Carolina
              </option>
              <option value="ND" className="cursor-pointer">
                North Dakota
              </option>
              <option value="OH" className="cursor-pointer">
                Ohio
              </option>
              <option value="OK" className="cursor-pointer">
                Oklahoma
              </option>
              <option value="OR" className="cursor-pointer">
                Oregon
              </option>
              <option value="PA" className="cursor-pointer">
                Pennsylvania
              </option>
              <option value="RI" className="cursor-pointer">
                Rhode Island
              </option>
              <option value="SC" className="cursor-pointer">
                South Carolina
              </option>
              <option value="SD" className="cursor-pointer">
                South Dakota
              </option>
              <option value="TN" className="cursor-pointer">
                Tennessee
              </option>
              <option value="TX" className="cursor-pointer">
                Texas
              </option>
              <option value="UT" className="cursor-pointer">
                Utah
              </option>
              <option value="VT" className="cursor-pointer">
                Vermont
              </option>
              <option value="VA" className="cursor-pointer">
                Virginia
              </option>
              <option value="WA" className="cursor-pointer">
                Washington
              </option>
              <option value="WV" className="cursor-pointer">
                West Virginia
              </option>
              <option value="WI" className="cursor-pointer">
                Wisconsin
              </option>
              <option value="WY" className="cursor-pointer">
                Wyoming
              </option>
            </select>
          </div>
          <div className="mt-5">
            <label
              htmlFor="services"
              className="block  text-sm font-medium text-left"
            >
              Service(s) you want to provide
            </label>
            <div>
              {params.slug == "motorcycle" && (
                <div className="grid grid-cols-2 ">
                  <div className="flex my-5 items-center ">
                    <input
                      id="bikeRider"
                      value="bikeRider"
                      type="checkbox"
                      onChange={handleChange}
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded-sm  "
                    />
                    <label
                      htmlFor="BikeRider"
                      className="ms-2 text-sm font-medium "
                    >
                      Bike Rider
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="foodDelivery"
                      value="foodDelivery"
                      type="checkbox"
                      onChange={handleChange}
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded-sm  "
                    />
                    <label
                      htmlFor="food delivery"
                      className="ms-2 text-sm font-medium"
                    >
                      Food Delivery
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="parcelDelivery"
                      value="parcelDelivery"
                      onChange={handleChange}
                      type="checkbox"
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded-sm  "
                    />
                    <label
                      htmlFor="parcelDelivery"
                      className="ms-2 text-sm font-medium"
                    >
                      Parcel Delivery
                    </label>
                  </div>
                </div>
              )}
              {params.slug == "cycle" && (
                <div className="grid grid-cols-2 ">
                  <div className="flex  my-5 items-center ">
                    <input
                      id="cycleFoodDelivery"
                      type="checkbox"
                      onChange={handleChange}
                      value="cycleFoodDelivery"
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded-sm  "
                    />
                    <label
                      htmlFor="Cycle Food Delivery"
                      className="ms-2 text-sm font-medium "
                    >
                      Food Delivery
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="cyclePercelDelivery"
                      value="cyclePercelDelivery"
                      type="checkbox"
                      onChange={handleChange}
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded-sm  "
                    />
                    <label
                      htmlFor="cyclePercelDelivery"
                      className="ms-2 text-sm font-medium"
                    >
                      Percel Delivery
                    </label>
                  </div>
                </div>
              )}
              {params.slug == "car" && (
                <div className="grid grid-cols-2 ">
                  <div className="flex  my-5 items-center ">
                    <input
                      id="autoLaneCar"
                      value="autoLaneCar"
                      type="checkbox"
                      onChange={handleChange}
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded-sm  "
                    />
                    <label
                      htmlFor="AutoLaneCar"
                      className="ms-2 text-sm font-medium "
                    >
                      AutoLane Car
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=" mx-auto flex justify-between bg-gray-300 px-3 py-2 rounded-sm my-5 text-md ">
          <span>Potential Earning Per Month*</span>
          <span className="text-red-700 select-none">$ {earning}</span>
        </div>
        <div className="text-red-600">{formError}</div>
        <div className="flex">
          <div
            onClick={handleRedirectToForm}
            className="text-white cursor-pointer bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 hover:ml-1 hover:shadow-md transition-all duration-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Next Step
          </div>
        </div>
        <div className="text-xs flex gap-1 mt-2 text-left">
          By clicking this button, you are agreeing to AutoLane
          <span className="text-red-500 cursor-pointer">
            terms and privacy policy
          </span>
        </div>
      </form>
    </div>
  );
};

export default Form;
