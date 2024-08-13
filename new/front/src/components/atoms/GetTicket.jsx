import { IoTicketSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
const GetTicket = () => {
  return (
    <div>
      <Link to={"/dashboard"}>
        <button className="px-5 focus:ring-4 active:scale-100 mt-3 mx-auto  py-3 flex text-center text-white hover:text-slate-600 hover:bg-slate-300  hover:scale-105 hover:rounded-lg bg-slate-400 rounded transition-all duration-300 text-2xl hover:shadow-xl">
          <IoTicketSharp className="mt-1 mx-1" /> Get Ticket
        </button>
      </Link>
    </div>
  );
};

export default GetTicket;
