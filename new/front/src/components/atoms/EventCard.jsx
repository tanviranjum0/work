import GetTicket from "./GetTicket";

const EventCard = () => {
  return (
    <div className="flex flex-col">
      <div className="main-bg mx-auto  w-[20rem] rounded hover:scale-105 transition-all duration-300 min-h-[30rem]"></div>
      <div className="text-2xl text-center pt-5">
        Nachiketa Live in Barcelona{" "}
      </div>
      <GetTicket />
    </div>
  );
};

export default EventCard;
