import Navbar from "../components/moleculas/Navbar";
import { FaClock } from "react-icons/fa";
import { IoTicketSharp } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="main-bg">
        <div className="absolute flex flex-col mt-32 left-[20%] ">
          <button className="px-6 mt-3 mx-auto gap-4 py-4 flex text-center hover:bg-slate-300  hover:scale-105 hover:rounded-lg bg-slate-400 rounded transition-all duration-300 text-2xl hover:shadow-xl">
            <IoTicketSharp className="mt-1" /> Get Ticket
          </button>

          <div className="flex gap-4 mt-5 text-xl">
            <div className="text-[#DAF7A6] flex ">
              <FaClock className="mt-1" />
              Friday, 6 September, 2024
            </div>
            <div className="text-[#DAF7A6] flex">
              <IoLocationSharp className="mt-1" />
              Barcelona, Spain
            </div>
          </div>
        </div>

        <div className="absolute flex flex-col mt-20 right-[15%]">
          <div className="text-7xl text-slate-300 text-center shadow-lg">
            NACHIKETA
          </div>
          <div className="text-5xl text-slate-400">LIVE IN BARCELONA</div>
          <div className="text-2xl text-center text-slate-400 font-mono">
            With{" "}
            <div className="text-7xl text-red-400">
              <i>James Bond</i>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
