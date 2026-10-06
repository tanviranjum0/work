import { useEffect, useState } from "react";
import demo from "/icon-quickride.png";
import { ChevronRight, CircleUserRound, History, KeyRound, Menu, X } from "lucide-react";
import Button from "./Button";
import api, { clearSession } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import Console from "../utils/console";

function Sidebar({ showSidebar, setShowSidebar }) {
  const [newUser, setNewUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setNewUser(userData);
  }, []);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post(`/${newUser.type}/logout`);
    } catch (error) {
      Console.log("Error getting logged out", error);
    } finally {
      // Always finish logging out locally, even if the server call failed (e.g. the
      // access token had already expired) — the user asked to leave either way.
      clearSession();
      navigate("/");
    }
  };
  return (
    <>
      {/* Dim backdrop: tap outside the drawer to close (desktop/tablet) */}
      <div
        className={`${showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"} sm:bg-black/30 transition-opacity duration-300 absolute inset-0 z-[9]`}
        onClick={() => setShowSidebar(false)}
        aria-hidden="true"
      />

      {/* Sidebar Component */}
      <div
        role="dialog"
        aria-label="Profile menu"
        aria-hidden={!showSidebar}
        className={`${showSidebar ? " left-0 " : " -left-full "
          } z-10 duration-300 absolute w-full sm:w-[380px] sm:shadow-2xl h-dvh bottom-0 bg-white p-4 pt-5 flex flex-col justify-between overflow-y-auto`}
      >
        <div className="">
          <div className="flex items-center justify-between">
            <h1 className="relative text-2xl font-semibold ">Profile</h1>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-zinc-100"
              aria-label="Close menu"
              onClick={() => setShowSidebar(false)}
            >
              <X />
            </button>
          </div>

          <div className="leading-3 mt-8 mb-4">
            <div className="my-2 rounded-full w-24 h-24 bg-blue-400 mx-auto flex items-center justify-center">
              <h1 className="text-5xl text-white">
                {newUser?.data?.fullname?.firstname[0]}
                {newUser?.data?.fullname?.lastname[0]}
              </h1>
            </div>
            <h1 className=" text-center font-semibold text-2xl">
              {newUser?.data?.fullname?.firstname}{" "}
              {newUser?.data?.fullname?.lastname}
            </h1>
            <h1 className="mt-1 text-center text-zinc-400 ">
              {newUser?.data?.email}
            </h1>
          </div>

          <Link
            to={`/${newUser?.type}/edit-profile`}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-zinc-100 rounded-xl px-3"
          >
            <div className="flex gap-3">
              <CircleUserRound /> <h1>Edit Profile</h1>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Link>

          <Link
            to={`/${newUser?.type}/rides`}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-zinc-100 rounded-xl px-3"
          >
            <div className="flex gap-3">
              <History /> <h1>Ride History</h1>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Link>

          <Link
            to={`/${newUser?.type}/forgot-password`}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-zinc-100 rounded-xl px-3"
          >
            <div className="flex gap-3">
              <KeyRound /> <h1>Change Password</h1>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Link>
        </div>

        <Button title={"Logout"} classes={"bg-red-600"} fun={logout} />
      </div>
    </>
  );
}


export default Sidebar;
