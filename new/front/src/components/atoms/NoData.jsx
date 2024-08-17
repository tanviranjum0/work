import React from "react";

const NoData = () => {
  return (
    <div>
      <div className="my-5 w-[80%] text-2xl flex flex-col justify-center items-center ">
        <div> No Data Found. Create a Ticket </div>

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
    </div>
  );
};

export default NoData;
