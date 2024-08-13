import React, { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import Footer from "../components/moleculas/Footer";
function Tickets() {
  const { data, isFetching } = useQuery({
    queryKey: ["ticket"],
    queryFn: () => {
      return fetch("http://localhost:3000/api/tickets", {
        method: "GET",
        headers: {
          authorization: `${localStorage.getItem("auth")}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    },
    refetchOnWindowFocus: false,
  });

  if (isFetching) return <Loader />;
  return (
    <>
      <div className=" rounded-sm border border-stroke px-5 pt-20 pb-2.5 shadow sm:px-7.5 xl:pb-1 mt-6 md:w-[80%] mx-auto my-20">
        <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
          <div className="relative flex-2 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Type to search.."
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  left-0 text-primary"
            />
            <span className="absolute left-2 py-3 text-xl">
              <BiSearch />
            </span>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto py-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-center">
                <th className="py-4 px-4 font-medium text-black">Date</th>
                <th className="py-4 px-4 font-medium text-black">Seating</th>
                <th className="py-4 px-4 font-medium text-black">Payment</th>
                <th className="py-4 px-4 font-medium text-black">Status</th>
                <th className="py-4 px-4 font-medium text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((ticket) => {
                return (
                  <tr className="text-center" key={ticket._id}>
                    <td className="border-b border-accent py-5 px-4">
                      <p className="text-black ">
                        {new Date(ticket.createdAt).toLocaleString("en-US")}
                      </p>
                    </td>
                    <td className="border-b border-accent py-5 px-4">
                      <p className="text-black ">{ticket.seating}</p>
                    </td>
                    <td className="border-b border-accent py-5 px-4">
                      <p className="text-black ">{ticket.payment}</p>
                    </td>
                    <td className="border-b rounded-full border-red-400">
                      <div
                        className={`rounded-full ${
                          ticket.status === "new"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } h-8 w-50`}
                      >
                        <p className="text-black py-1">{ticket.status}</p>
                      </div>
                    </td>

                    <td className="border-b border-accent py-5 px-4">
                      <Link
                        to={`/ticket/${ticket._id}`}
                        className="flex justify-center"
                      >
                        <button className="hover:text-black">
                          <FaRegEye className="text-primary text-2xl hover:text-accent text-center" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Tickets;
