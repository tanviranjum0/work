import { Link } from "react-router-dom";
import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";
import Footer from "../components/moleculas/Footer";
function Dashboard() {
  return (
    <div className="dashboard-bg text-white">
      <section className="heading parent pt-20 mb-20 heading text-center text-slate-200">
        <h1 className="pt-12 text-4xl">Buy Now Raisa Tickets!</h1>
        <p className="text-slate-300 text-2xl pt-3">
          Please choose from an option below
        </p>
      </section>
      <div className="grid justify-center sm:flex sm:justify-center translate-y-[-20%] sm:translate-y-[-0%]">
        <Link
          to="/new-ticket"
          className="primary-button flex bg-slate-400 text-slate-900 uppercase hover:bg-slate-500 px-4 py-2 rounded-lg "
        >
          <button className="uppercase">Create Ticket</button>
          <span className="mt-1 px-1">
            <FaQuestionCircle />
          </span>
        </Link>
      </div>
      <div className="grid justify-center sm:flex  sm:justify-center translate-y-[-20%] sm:translate-y-[-0%] mt-8">
        <Link
          to="/tickets"
          className="bg-slate-400 flex text-slate-900 uppercase hover:bg-slate-500 px-4 py-2 rounded-lg"
        >
          <span className="uppercase">View My Tickets</span>
          <span className="mt-1 px-1">
            <FaTicketAlt />
          </span>
        </Link>
      </div>
      <div className="bg-black mt-20">
        {" "}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
