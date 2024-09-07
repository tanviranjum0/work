import Flight from "./Flight";

const Flights = () => {
  return (
    <div className="w-[90vw] mt-10 mx-auto">
      <div className="text-center text-4xl">
        Flights From Dhaka To Chattogram
      </div>
      <div className="flex gap-10 w-[90vw] mt-5">
        <div className="rounded-lg border w-full hover:bg-slate-200 transition-all duration-200 text-center p-4">
          <div className="text-2xl">Cheapest</div>
          <div className="">To get available cheapest flights</div>
        </div>

        <div className="rounded-lg border w-full hover:bg-slate-200 transition-all duration-200 text-center p-4">
          <div className="text-2xl">Shortest</div>
          <div className="">To get available shortest flights</div>
        </div>
      </div>
      <Flight />
      <Flight />
      <Flight />
    </div>
  );
};

export default Flights;
