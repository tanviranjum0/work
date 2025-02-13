/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { FormContext } from "@/components/context/FormContext";
import Image from "next/image";
import React, { useContext, useState } from "react";
import avater from "../../../../images/appRelated/avater.jpeg";

const carModels = {
  toyota: ["Corolla", "Camry", "Rav4", "Highlander"],
  honda: ["Civic", "Accord", "CR-V", "Pilot"],
  ford: ["Fiesta", "Focus", "Mustang", "Explorer"],
  bmw: ["X1", "X3", "X5", "M3"],
  audi: ["A3", "A4", "A6", "Q5"],
  mercedes: ["C-Class", "E-Class", "S-Class", "GLC"],
  nissan: ["Altima", "Sentra", "Rogue", "370Z"],
  chevrolet: ["Malibu", "Camaro", "Tahoe", "Silverado"],
  hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe"],
  kia: ["Rio", "Soul", "Sportage", "Sorento"],
  volkswagen: ["Golf", "Passat", "Tiguan", "Jetta"],
  porsche: ["911", "Cayenne", "Panamera", "Macan"],
  subaru: ["Impreza", "Outback", "Forester", "WRX"],
  mazda: ["Mazda3", "Mazda6", "CX-5", "CX-9"],
  volvo: ["S60", "XC60", "XC90", "V90"],
  jaguar: ["XE", "XF", "F-Type", "F-Pace"],
  land_rover: ["Defender", "Discovery", "Range Rover", "Evoque"],
  tesla: ["Model S", "Model 3", "Model X", "Model Y"],
  fiat: ["500", "Panda", "Tipo", "Doblo"],
  peugeot: ["208", "3008", "508", "5008"],
  renault: ["Clio", "Megane", "Captur", "Kadjar"],
};

const app = () => {
  const { formData, setFormData } = useContext(FormContext);
  const [identityType, setIdentityType] = useState();
  console.log(identityType);
  console.log(formData);
  const [imageFile, setImageFile] = useState({ imagePreview: avater });
  const [selectedVehicleBrand, setSelectedVehicleBrand] = useState({
    vehicleBrand: "toyota",
  });
  const handleBrandChange = (event: React.FormEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setSelectedVehicleBrand({ vehicleBrand: event.target.value });
    setFormData({ ...formData, vehicleBrand: event.target.value });
  };

  const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.onloadend = () => {
        setImageFile({
          imagePreview: reader.result,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pb-20 bg-yellow-50">
      <div className="w-[50vw] shadow-lg p-2 mb-10 rounded-md mx-auto">
        <div className="h-14 bg-gray-200 p-2 font-semibold text-2xl">
          01 Personal Information
        </div>
        <div className="p-1">
          <div className="flex w-full gap-4">
            <div className="flex w-full my-2 flex-col">
              <label
                className="text-semibold w-full text-md pb-1"
                htmlFor="First Name:*"
              >
                First Name*
              </label>
              <input
                disabled
                defaultValue={`${formData.firstName}`}
                type="text"
                className=" border p-1 border-gray-200 w-full rounded"
              />
            </div>
            <div className="flex my-2 w-full flex-col">
              <label
                className="text-semibold  w-full text-md pb-1"
                htmlFor="Last Name:*"
              >
                Last Name
              </label>
              <input
                disabled
                defaultValue={`${formData.lastName}`}
                type="text"
                className=" border border-gray-200 p-1  w-full rounded"
              />
            </div>
          </div>
          <div className="flex w-full my-2 flex-col">
            <label
              className="text-semibold  w-full text-md pb-1"
              htmlFor="First Name:*"
            >
              Phone Number*
            </label>
            <input
              type="number"
              disabled
              defaultValue={`${formData.phone}`}
              className=" border p-1 border-gray-200 w-full rounded"
            />
          </div>
          <div className="flex w-full my-2 flex-col">
            <label
              className="text-semibold  w-full text-md pb-1"
              htmlFor="Gender"
            >
              Gender*
            </label>
            <select
              id="gender"
              className=" border p-2 border-gray-200 w-full rounded"
            >
              <option value="male" className="cursor-pointer">
                Male
              </option>
              <option value="female" className="cursor-pointer">
                Female
              </option>
            </select>
          </div>
          <div className="flex w-full my-2 flex-col">
            <label
              className="text-semibold  w-full text-md pb-1"
              htmlFor="First Name:*"
            >
              Date of birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="DOB"
              className="border p-2 border-gray-200 w-full rounded"
            />
          </div>
          <div className="flex w-full my-2 flex-col">
            <label
              className="text-semibold  w-full text-md pb-1"
              htmlFor="Services"
            >
              Services you want to provide
            </label>
            <div className="flex gap-4">
              {formData.bikeRider && (
                <div className="w-full flex items-center px-3 py-2 text-yellow-800 bg-gray-100 border-gray-300 rounded-sm ">
                  ✔ Bike Rider
                </div>
              )}
              {formData.foodDelivery && (
                <div className="w-full flex items-center px-3 py-2 text-yellow-800 bg-gray-100 border-gray-300 rounded-sm ">
                  ✔ Food Delivery
                </div>
              )}
              {formData.parcelDelivery && (
                <div className="w-full flex items-center px-3 py-2 text-yellow-800 bg-gray-100 border-gray-300 rounded-sm ">
                  ✔ Parcel Delivery
                </div>
              )}
              {formData.autoLaneCar && (
                <div className="w-full flex items-center px-3 py-2 text-yellow-800 bg-gray-100 border-gray-300 rounded-sm ">
                  ✔ AutoLane Car
                </div>
              )}
              {formData.cycleFoodDelivery && (
                <div className="w-full flex items-center px-3 py-2 text-yellow-800 bg-gray-100 border-gray-300 rounded-sm ">
                  ✔ Cycle Food Deliery
                </div>
              )}
              {formData.cyclePercelDelivery && (
                <div className="w-full flex items-center px-3 py-2 text-yellow-800 bg-gray-100 border-gray-300 rounded-sm ">
                  ✔ Cycle Parcel Delivery
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full my-2 flex-col">
            <label
              className="text-semibold  w-full text-md pb-1"
              htmlFor="  Select Identity Type*"
            >
              Select Identity Type*
            </label>
            <select
              id="id"
              className="cursor-pointer border p-2 border-gray-200 w-full rounded"
            >
              <option
                value={"nid"}
                onClick={() => setIdentityType("nid")}
                className="cursor-pointer"
              >
                National ID
              </option>
              <option
                value={"passport"}
                onClick={() => setIdentityType("passport")}
                className="cursor-pointer"
              >
                Passport
              </option>
            </select>
          </div>
          <div className="flex w-full my-2 flex-col">
            <label className="text-semibold  w-full text-md pb-1" htmlFor="Id">
              {identityType} Number
            </label>
            <input
              type="text"
              className=" border p-1 border-gray-200 w-full rounded"
            />
          </div>
          <div className="flex w-full my-2 flex-col">
            <label
              className="text-semibold  w-full text-md pb-1"
              htmlFor="Refferal Code"
            >
              Refferal Code
            </label>
            <input
              type="text"
              className=" border p-1 border-gray-200 w-full rounded"
            />
          </div>
          <div className="flex w-full my-2 flex-col">
            <label
              className="text-semibold  w-full text-md pb-1"
              htmlFor="First Name:*"
            >
              Upload your photo *
            </label>
            <div className="flex justify-between gap-4">
              <Image
                className="h-36 w-36"
                src={imageFile.imagePreview}
                alt="uploaded image"
                width={1000}
                height={1000}
              />

              <div className="flex  flex-col">
                <input onChange={handleImageInput} type="file" name="" id="" />
                <div className="text-xs">
                  *Please upload a clear image of your full face from front
                </div>
                <div className="text-xs">*Full face should be visible</div>
                <div className="text-xs">*Image size cannot exceed 1MB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[50vw] p-2 shadow-lg pb-10  rounded-md mx-auto">
        <div className="h-14 bg-gray-200 p-2 font-semibold text-2xl">
          02 Vehicle Information
        </div>
        <div className="">
          <div className="flex w-full gap-4">
            <div className="flex w-full my-2 flex-col">
              <label
                className="text-semibold  w-full text-md pb-1"
                htmlFor="brand"
              >
                Select Brand*
              </label>
              <select
                id="brand"
                defaultValue={"toyota"}
                className="border p-2 border-gray-200 w-full rounded"
                onChange={handleBrandChange}
              >
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="ford">Ford</option>
                <option value="bmw">BMW</option>
                <option value="audi">Audi</option>
                <option value="mercedes">Mercedes-Benz</option>
                <option value="nissan">Nissan</option>
                <option value="chevrolet">Chevrolet</option>
                <option value="hyundai">Hyundai</option>
                <option value="kia">Kia</option>
                <option value="volkswagen">Volkswagen</option>
                <option value="porsche">Porsche</option>
                <option value="subaru">Subaru</option>
                <option value="mazda">Mazda</option>
                <option value="volvo">Volvo</option>
                <option value="jaguar">Jaguar</option>
                <option value="land_rover">Land Rover</option>
                <option value="tesla">Tesla</option>
                <option value="fiat">Fiat</option>
                <option value="peugeot">Peugeot</option>
                <option value="renault">Renault</option>
              </select>
            </div>
            <div className="flex my-2 w-full flex-col">
              <label
                className="text-semibold  w-full text-md pb-1"
                htmlFor="Last Name:*"
              >
                Select Model*
              </label>
              <select
                id="brand"
                defaultValue={"toyota"}
                className="border p-2 border-gray-200 w-full rounded"
              >
                {carModels[selectedVehicleBrand.vehicleBrand].map((model) => {
                  return (
                    <option key={`${model}`} value={model}>
                      {model}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="flex my-2 w-full flex-col">
          <label
            className="text-semibold  w-full text-md pb-1"
            htmlFor="Last Name:*"
          >
            Registration Number*
          </label>
          <input
            type="text"
            id="registrationNumber"
            className="border p-1 border-gray-200 w-full rounded"
          />
        </div>
        <div className="flex my-2 w-full flex-col">
          <label
            className="text-semibold  w-full text-md pb-1"
            htmlFor="Last Name:*"
          >
            Select Year*
          </label>
          <select
            id="RegYear"
            defaultValue={"2025"}
            className="border p-2 border-gray-200 w-full rounded"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2016">2016</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option>
            <option value="2013">2013</option>
            <option value="2012">2012</option>
            <option value="2011">2011</option>
            <option value="2010">2010</option>
            <option value="2009">2009</option>
            <option value="2008">2008</option>
            <option value="2007">2007</option>
            <option value="2006">2006</option>
            <option value="2005">2005</option>
            <option value="2004">2004</option>
            <option value="2003">2003</option>
            <option value="2002">2002</option>
            <option value="2001">2001</option>
            <option value="2000">2000</option>
            <option value="1999">1999</option>
            <option value="1998">1998</option>
            <option value="1997">1997</option>
            <option value="1996">1996</option>
            <option value="1995">1995</option>
            <option value="1994">1994</option>
            <option value="1993">1993</option>
            <option value="1992">1992</option>
            <option value="1991">1991</option>
            <option value="1990">1990</option>
            <option value="1989">1989</option>
            <option value="1988">1988</option>
            <option value="1987">1987</option>
            <option value="1986">1986</option>
            <option value="1985">1985</option>
            <option value="1984">1984</option>
            <option value="1983">1983</option>
            <option value="1982">1982</option>
            <option value="1981">1981</option>
            <option value="1980">1980</option>
            <option value="1979">1979</option>
            <option value="1978">1978</option>
            <option value="1977">1977</option>
            <option value="1976">1976</option>
            <option value="1975">1975</option>
            <option value="1974">1974</option>
            <option value="1973">1973</option>
            <option value="1972">1972</option>
            <option value="1971">1971</option>
          </select>
        </div>
        <div className="flex my-2 w-full flex-col">
          <label
            className="text-semibold  w-full text-md pb-1"
            htmlFor="Last Name:*"
          >
            Tax Token Number*
          </label>
          <input
            type="text"
            id="taxTokenNumber"
            className="border p-1 border-gray-200 w-full rounded"
          />
        </div>
        <div className="flex my-2 w-full flex-col">
          <label
            className="text-semibold  w-full text-md pb-1"
            htmlFor="Last Name:*"
          >
            Fitness Number*
          </label>
          <input
            type="text"
            id="fitnessNumber"
            className="border p-1 border-gray-200 w-full rounded"
          />
        </div>
        <button className="my-2 transition-all duration-300 rounded  text-2xl text-semibold bg-yellow-100 px-3 py-2 hover:bg-yellow-200 w-full">
          Submit
        </button>
      </div>
    </div>
  );
};

export default app;
