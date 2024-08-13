import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import Footer from "../components/moleculas/Footer";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { RxCross2 } from "react-icons/rx";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { motion } from "framer-motion";
// import { useParams, useNavigate } from "react-router-dom";

function Ticket() {
  const navigate = useNavigate();
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const queryClient = useQueryClient();
  const { ticketId } = useParams();

  const handleNoteSubmit = () => {
    const text = document.getElementById("noteText").value;
    Mutation.mutate({ text });
    setNoteOpen(!noteOpen);
  };

  const newNote = (data) => {
    const res = fetch(`http://localhost:3000/api/tickets/notes/${ticketId}`, {
      method: "POST",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res;
  };

  const Mutation = useMutation({
    mutationFn: (noteText) => newNote(noteText),
    onSuccess: (data) => {
      data.json().then((e) => {
        if (e.message == "User not authorized") {
          toast.error("User not authorized");
        } else {
          queryClient.invalidateQueries({ queryKey: ["note"] });
          toast.success("Note created successfully");
          navigate(`/ticket/${e.message.ticket}`);
        }
      });
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const handleDelete = (id) => {
    const del = fetch(`http://localhost:3000/api/tickets/notes/${ticketId}`, {
      method: "DELETE",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }).then((res) => {
      res.json();
      queryClient.invalidateQueries({ queryKey: ["note"] });
      toast.success("Note deleted successfully");
    });
  };
  const handleClose = () => {
    fetch(`http://localhost:3000/api/tickets/${ticketId}`, {
      method: "DELETE",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    }).then((res) => {
      queryClient.invalidateQueries({ queryKey: ["note", "ticket"] });
      toast.success("Ticket closed successfully");
      navigate("/tickets");
    });
  };
  const { data: ticketData, isFetching } = useQuery({
    queryKey: ["ticket"],
    queryFn: () => {
      return fetch(`http://localhost:3000/api/tickets/${ticketId}`, {
        method: "GET",
        headers: {
          authorization: `${localStorage.getItem("auth")}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    },

    refetchOnWindowFocus: false,
  });
  const { data: noteData, isPending } = useQuery({
    queryKey: ["note"],
    queryFn: () => {
      return fetch(`http://localhost:3000/api/tickets/notes/${ticketId}`, {
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
  if (isPending) return <Loader />;
  return (
    <>
      <div className="w-[80%]  mx-auto text-start pt-5 my-20 text-primary">
        <header className="ticket-header">
          <h2 className="font-medium">
            Ticket ID : <span className="">{ticketData?._id}</span>
            <span>
              <p className="text-black text-center"></p>
            </span>
          </h2>
          <h3>
            <span className="font-medium">Date Submitted </span> :
            {new Date(ticketData?.updatedAt).toLocaleString("en-US")}
          </h3>
          <h3>
            {" "}
            <span className="font-medium">Seating </span> :{ticketData?.seating}
          </h3>
          <h3>
            {" "}
            <span className="font-medium">Payment </span> :{ticketData?.payment}
          </h3>
          <hr className="mt-5" />
          <div className="h-32 w-full p-4 border-4 bg-slate-200 rounded mt-5">
            <h3 className="font-medium">Description of Issue : </h3>
            {ticketData?.description}
            <p>descrition</p>
          </div>
          <h2 className="font-medium py-2">Notes</h2>
        </header>
        <button
          onClick={() => setNoteOpen(!noteOpen)}
          className="text-md flex py-2 transition-all duration-500 hover:bg-black hover:text-slate-300 px-3 rounded border-2 border-black "
        >
          <FaPlus className="mt-1 mr-2 text-md" /> Add Note
        </button>

        {noteData &&
          noteData.map((note, index) => (
            <div
              key={index + note.updatedAt}
              className="w-full my-5  relative pb-5 border rounded-lg p-5"
            >
              <div className="font-semibold text-2xl">
                Note from {note.user.name}
              </div>
              <div>{note.text}</div>
              <div className="absolute text-sm top-4 right-3 ">
                {" "}
                {new Date(note?.updatedAt).toLocaleString("en-US")}
              </div>

              <div
                onClick={() => {
                  handleDelete(note._id);
                }}
                className="absolute cursor-pointer text-2xl top-10  right-3 "
              >
                {" "}
                <MdDelete />
              </div>
            </div>
          ))}

        <button
          onClick={() => handleClose()}
          className="text-md flex py-2 transition-all duration-500 hover:bg-black hover:text-slate-300 px-3 rounded border-2 border-black mt-5"
        >
          <span>Close Ticket</span>
        </button>
      </div>
      {noteOpen ? (
        <div className="absolute top-0 left-0 z-10 backdrop-blur h-screen w-full ">
          <button
            onClick={() => setNoteOpen(!noteOpen)}
            className="absolute top-24 right-10 text-3xl font-light"
          >
            <RxCross2 />
          </button>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "backInOut" }}
            className="justify-center items-center  flex"
          >
            <form className="md:w-[60%] mx-auto absolute w-[90%] top-[40%] h-[100vh] z-30 ">
              <div className="flex  z-10 shadow-2xl shadow-slate-900  justify-center items-center">
                <textarea
                  name="noteText"
                  rows={3}
                  id="noteText"
                  className="w-full h-full p-5 bg-slate-300"
                  placeholder="Note text"
                  onChange={(e) => setNoteText(e.target.value)}
                ></textarea>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleNoteSubmit();
                }}
                className="px-4 py-2 w-full hover:bg-slate-500 bg-slate-400 transition-all transition-duration-300 flex justify-center"
              >
                Add Note
              </button>
            </form>
          </motion.div>
        </div>
      ) : null}
      {!noteOpen ? <Footer /> : null}
    </>
  );
}

export default Ticket;
