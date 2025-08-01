import React from "react";
import insuredIcon from "../../images/vehicleImage/icons/icon-insured.png";
import bonusIcon from "../../images/vehicleImage/icons/icon-bonus.png";
import timeIcon from "../../images/vehicleImage/icons/icon-time.png";
import motorcycleIcon from "../../images/vehicleImage/icons/icon-bike.jpg";
import carIcon from "../../images/vehicleImage/icons/icon-car.png";
import parcelIcon from "../../images/vehicleImage/icons/icon-delivery.jpg";
import foodIcon from "../../images/vehicleImage/icons/icon-food.jpg";
import { FaAngleDown } from "react-icons/fa";
import Image from "next/image";

const SideFormSection: React.FC<{ params: { slug: string } }> = ({
  params,
}) => {
  return (
    <div>
      <section className="text-left  overflow-scroll scroll-smooth no-scrollbar no-scrollbar::-webkit-scrollbar w-[90%] mx-auto h-[120vh]">
        {params.slug == "motorcycle" && (
          <div>
            <h2 className="text-4xl p-4 font-semibold">Got a {params.slug}?</h2>
            <p className="text-xl text-gray-700 px-4">
              These are the services you can be a part of!
            </p>
            <div className="pt-10 pb-20 text-xl  font-bold grid gap-5 grid-cols-2 px-5">
              <div className="flex  gap-3 place-self-start justify-center items-center">
                <div className="h-10 w-10">
                  <Image
                    alt="motorcycleIcon"
                    src={motorcycleIcon}
                    width={1000}
                    height={1000}
                    quality={100}
                  />
                </div>
                <p className="text-xl font-bold">Bike Rider</p>
              </div>
              <div className="flex gap-3 place-self-start justify-center items-center">
                <div className="h-10 w-10">
                  <Image
                    alt="motorcycleIcon"
                    src={foodIcon}
                    width={1000}
                    height={1000}
                    quality={100}
                  />
                </div>
                <p className="text-xl font-bold">Food Delivery</p>
              </div>
              <div className="flex gap-3 place-self-start justify-center items-center">
                <div className="h-10 w-10">
                  <Image
                    alt="parcelIcon"
                    src={parcelIcon}
                    width={1000}
                    height={1000}
                    quality={100}
                  />
                </div>
                <p className="text-xl font-bold">Food Delivery</p>
              </div>
            </div>

            <h4 className="text-4xl p-3">
              AutoLane Bike: Easy Income Opportunity!
            </h4>
            <div className="text-xl text-gray-700 p-4">
              Now earn from 45,000 to 50,000 taka per month being a AutoLane
              Bike rider. As a new rider, enjoy 1% commission on ride sharing.
              Parcel - Along with ride sharing, take the opportunity to earn
              extra income through parcel delivery. Become a AutoLane Hero
              today!
            </div>

            <div className="w-full text-2xl flex justify-center animate-bounce">
              <FaAngleDown />
            </div>
            <div className="py-10 px-4">
              <div className="flex justify-center items-center gap-6">
                <div className="h-20 flex justify-center items-center  w-20">
                  <Image
                    src={insuredIcon}
                    alt="InsuredIcon"
                    height={1000}
                    width={1000}
                  />
                </div>
                <div className="p-1">
                  <div className="text-xl font-semibold">
                    Your Ride is secured
                  </div>
                  <div className="text-gray-700">
                    AutoLane cares about your safety. And to keep you safe,
                    AutoLane is giving you safety coverage.
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-6">
                <div className="h-20 flex justify-center items-center  w-20">
                  <Image
                    src={bonusIcon}
                    alt="bonusIcon"
                    height={1000}
                    width={1000}
                  />
                </div>
                <div className="p-1">
                  <div className="text-xl font-semibold">
                    Earn More with Bonus
                  </div>
                  <div className="text-gray-700">
                    With AutoLane daily quests and attractive special offers,
                    you can extra regularly.
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-6">
                <div className="h-20 flex justify-center items-center  w-20">
                  <Image
                    src={timeIcon}
                    alt="timeIcon"
                    height={1000}
                    width={1000}
                  />
                </div>
                <div className="p-1">
                  <div className="text-xl font-semibold">
                    Get Your Payment on Time
                  </div>
                  <div className="text-gray-700">
                    With AutoLane, you will never face a delay in payment. Get
                    your payment in the shortest time!
                  </div>
                </div>
              </div>
            </div>
            <div className="text-3xl p-3">What is required to apply</div>
            <div className="text-xl pb-4 px-3 text-gray-700">
              Not sure if you’re eligible to be a rider? If you have the
              following, you can join us!
            </div>
            <div className="p-4 flex gap-3 items-center">
              <div className="h-10 rounded-full w-10 flex justify-center items-center font-semibold text-xl bg-yellow-700 text-white">
                1
              </div>
              <div className="text-xl font-semibold">
                Original copy of National Identity Card.
              </div>
            </div>
            <div className="p-4 flex gap-3 items-center">
              <div className="h-10 rounded-full w-10 flex justify-center items-center font-semibold text-xl bg-yellow-700 text-white">
                2
              </div>
              <div className="text-xl font-semibold">
                Driving License (Professional / Non-Professional).
              </div>
            </div>
            <div className="p-4 flex gap-3 items-center">
              <div className="h-10 rounded-full w-10 flex justify-center items-center font-semibold text-xl bg-yellow-700 text-white">
                3
              </div>
              <div className="text-xl font-semibold">
                Vehicle Registration Paper.
              </div>
            </div>
            <div className="p-4 flex gap-3 items-center">
              <div className="h-10 rounded-full w-10 flex justify-center items-center font-semibold text-xl bg-yellow-700 text-white">
                4
              </div>
              <div className="text-xl font-semibold">Tax Token.</div>
            </div>
          </div>
        )}
        {params.slug == "car" && (
          <div>
            <h2 className="text-4xl p-4 font-semibold">Got a {params.slug}?</h2>
            <p className="text-xl text-gray-700 px-4">
              These are the services you can be a part of!
            </p>
            <div className="pt-10 pb-20 text-xl  font-bold grid gap-5 grid-cols-2 px-5">
              <div className="flex  gap-3 place-self-start justify-center items-center">
                <div className="h-10 w-10">
                  <Image
                    alt="carIcon"
                    src={carIcon}
                    width={1000}
                    height={1000}
                    quality={100}
                  />
                </div>
                <p className="text-xl font-bold">AutoLane Car</p>
              </div>
            </div>

            <h4 className="text-4xl p-3">
              AutoLane Car: Your New Income Opportunity!
            </h4>
            <div className="text-xl text-gray-700 p-4">
              Now earn from 70,000 to 1,00,000 taka per month on AutoLane Car,
              plus as a new driver, enjoy 0% commission on ride sharing.
            </div>

            <div className="w-full text-2xl flex justify-center animate-bounce">
              <FaAngleDown />
            </div>
            <div className="py-10 px-4">
              <div className="flex justify-center items-center gap-6">
                <div className="h-20  w-20">
                  <Image
                    src={insuredIcon}
                    alt="InsuredIcon"
                    height={1000}
                    width={1000}
                  />
                </div>
                <div className="p-1">
                  <div className="text-xl font-semibold">
                    Star Captain Program
                  </div>
                  <div className="text-gray-700">
                    Achieve Silver, Gold or Platinum levels by meeting specific
                    targets.
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-6">
                <div className="h-20  w-20">
                  <Image
                    src={bonusIcon}
                    alt="bonusIcon"
                    height={1000}
                    width={1000}
                  />
                </div>
                <div className="p-1">
                  <div className="text-xl font-semibold">Rental Service</div>
                  <div className="text-gray-700">
                    Book a trip in advance by setting your preferred fare
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-6">
                <div className="h-20   w-20">
                  <Image
                    src={timeIcon}
                    alt="timeIcon"
                    height={1000}
                    width={1000}
                  />
                </div>
                <div className="p-1">
                  <div className="text-xl font-semibold">Intercity Trip</div>
                  <div className="text-gray-700">
                    Increase your income by taking intercity trips to any part
                    of USA
                  </div>
                </div>
              </div>
            </div>
            <div className="text-3xl p-3">What is required to apply</div>
            <div className="text-xl pb-4 px-3 text-gray-700">
              Not sure if you&aps;re eligible to be a Captain? If you have the
              following, you can join us!
            </div>
            <div className="p-4 flex gap-3 items-center">
              <div className="h-10 rounded-full w-10 flex justify-center items-center font-semibold text-xl bg-yellow-700 text-white">
                1
              </div>
              <div className="text-xl font-semibold">
                Original copy of National Identity Card.
              </div>
            </div>
            <div className="p-4 flex gap-3 items-center">
              <div className="h-10 rounded-full w-10 flex justify-center items-center font-semibold text-xl bg-yellow-700 text-white">
                2
              </div>
              <div className="text-xl font-semibold">
                Driving License (Professional / Non-Professional).
              </div>
            </div>
            <div className="p-4 flex gap-3 items-center">
              <div className="h-10 rounded-full w-10 flex justify-center items-center font-semibold text-xl bg-yellow-700 text-white">
                3
              </div>
              <div className="text-xl font-semibold">
                Vehicle Registration Paper.
              </div>
            </div>
            <div className="p-4 flex gap-3 items-center">
              <div className="h-10 rounded-full w-10 flex justify-center items-center font-semibold text-xl bg-yellow-700 text-white">
                4
              </div>
              <div className="text-xl font-semibold">Tax Token.</div>
            </div>
          </div>
        )}
        {params.slug == "cycle" && (
          <div>
            <h2 className="text-4xl p-4 font-semibold">Got a {params.slug}?</h2>
            <p className="text-xl text-gray-700 px-4">
              These are the services you can be a part of!
            </p>
            <div className="pt-10 pb-20 text-xl  font-bold grid gap-5 grid-cols-2 px-5">
              <div className="flex gap-3 place-self-start justify-center items-center">
                <div className="h-10 w-10">
                  <Image
                    alt="foodIcon"
                    src={foodIcon}
                    width={1000}
                    height={1000}
                    quality={100}
                  />
                </div>
                <p className="text-xl font-bold">Food Man</p>
              </div>
              <div className="flex gap-3 place-self-start justify-center items-center">
                <div className="h-10 w-10">
                  <Image
                    alt="parcelIcon"
                    src={parcelIcon}
                    width={1000}
                    height={1000}
                    quality={100}
                  />
                </div>
                <p className="text-xl font-bold">Parcel Delivery</p>
              </div>
            </div>

            <h4 className="text-4xl p-3">
              AutoLane Cycle: New Income Opportunity!
            </h4>
            <div className="text-xl text-gray-700 p-4">
              Being with AutoLane means being on the highest earning platform!
              So, what are you waiting for? Join us to earn the most!
            </div>

            <div className="w-full text-2xl flex justify-center animate-bounce">
              <FaAngleDown />
            </div>
            <div className="py-10 px-4">
              <div className="flex justify-center items-center gap-6">
                <div className="h-20 w-20">
                  <Image
                    src={insuredIcon}
                    alt="InsuredIcon"
                    height={1000}
                    width={1000}
                  />
                </div>
                <div className="p-1">
                  <div className="text-xl font-semibold">AutoLane Parcel</div>
                  <div className="text-gray-700">
                    You can earn 25,000 to 30,000 taka per month.
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-6">
                <div className="h-20 w-20">
                  <Image
                    src={bonusIcon}
                    alt="bonusIcon"
                    height={1000}
                    width={1000}
                  />
                </div>
                <div className="p-1">
                  <div className="text-xl font-semibold">AutoLane Food</div>
                  <div className="text-gray-700">
                    Your time and effort at AutoLane is very important to us
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-6">
                <div className="h-20 w-20">
                  <Image
                    src={timeIcon}
                    alt="timeIcon"
                    height={1000}
                    width={1000}
                  />
                </div>
                <div className="p-1">
                  <div className="text-xl font-semibold">
                    Get Your Payment on Time
                  </div>
                  <div className="text-gray-700">
                    With AutoLane, you will never face a delay in payment.
                  </div>
                </div>
              </div>
            </div>
            <div className="text-3xl p-3">What is required to apply</div>
            <div className="text-xl pb-4 px-3 text-gray-700">
              Not sure if you’re eligible to be a rider? If you have the
              following, you can join us!
            </div>
            <div className="p-4 flex gap-3 items-center">
              <div className="h-10 rounded-full w-10 flex justify-center items-center font-semibold text-xl bg-yellow-700 text-white">
                1
              </div>
              <div className="text-xl font-semibold">
                Original copy of National Identity Card.
              </div>
            </div>
            <div className="p-4 flex gap-3 items-center">
              <div className="h-10 rounded-full w-10 flex justify-center items-center font-semibold text-xl bg-yellow-700 text-white">
                2
              </div>
              <div className="text-xl font-semibold">
                Original copy of National Identity Card of the reference
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SideFormSection;
