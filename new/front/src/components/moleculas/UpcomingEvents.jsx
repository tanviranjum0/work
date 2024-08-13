import EventCard from "../atoms/EventCard";

const UpcomingEvents = () => {
  return (
    <div className="grid w-full md:w-[90%] mx-auto grid-cols-1 justify-center items-center">
      <div className="mx-auto mt-10 col-span-12 text-4xl font-bold font-mono text-yellow-300">
        Upcoming Events
      </div>
      <div className=" mt-10 mx-auto">
        {" "}
        <EventCard></EventCard>
      </div>
    </div>
  );
};

export default UpcomingEvents;
