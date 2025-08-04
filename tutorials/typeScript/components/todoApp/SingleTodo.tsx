"use client";
import { motion, AnimatePresence } from "motion/react";
import { MdEdit } from "react-icons/md";
import { useRef, useState, useEffect, FormEvent } from "react";
import { MdDone } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { SingleTodoProps } from "@/models/model";
const SingleTodo = ({ todos, todo, setTodos }: SingleTodoProps) => {
  const [edit, setEdit] = useState(false);
  const focus = useRef<HTMLInputElement>(null);
  useEffect(() => {
    focus.current?.focus();
  }, [edit]);
  const handleDelete = () => {
    setEdit(false);
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    localStorage.setItem("TodoAppTodos", JSON.stringify(todos));
  };
  const handleDone = () => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, isDone: !t.isDone } : t))
    );
    localStorage.setItem("TodoAppTodos", JSON.stringify(todos));
  };
  const handleToggleEdit = () => {
    setEdit((prev) => !prev);
  };
  const handleUpdateTodo = (e: FormEvent) => {
    e.preventDefault();
    const updatedTodo = document.getElementById(
      "textupdate"
    ) as HTMLInputElement;
    if (!updatedTodo || updatedTodo.value.trim() === "") {
      return;
    }

    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id ? { ...t, todo: `${updatedTodo.value}` } : t
      )
    );
    localStorage.setItem("TodoAppTodos", JSON.stringify(todos));
    setEdit(false);
  };
  return (
    <div>
      <div className="flex justify-between bg-teal-100 py-2 px-3 rounded ">
        <motion.div
          layout
          initial={{ display: "none" }}
          animate={{ display: "block" }}
          exit={{ display: "none" }}
          transition={{ duration: 0.5 }}
          className={`text-lg ${todo.isDone ? "line-through" : ""}`}
        >
          {todo.todo}
        </motion.div>
        <motion.div
          layout
          initial={{ display: "none" }}
          animate={{ display: "flex" }}
          exit={{ display: "none" }}
          transition={{ duration: 0.5 }}
          className="flex gap-4 py-2 text-bold text-xl"
        >
          <button
            onClick={handleToggleEdit}
            className="cursor-pointer focus:scale-95 hover:scale-110 transition-all duration-200"
          >
            <MdEdit />
          </button>
          <button
            onClick={handleDone}
            className="cursor-pointer focus:scale-95 hover:scale-110 transition-all duration-200"
          >
            {todo.isDone ? <IoMdDoneAll /> : <MdDone />}
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer focus:scale-95 hover:scale-110 transition-all duration-200"
          >
            <MdDelete />
          </button>
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        {" "}
        {edit && (
          <motion.form
            initial={{
              height: 0,
              width: 0,
              x: "50vw",
              opacity: 0,
            }}
            animate={{
              height: "fit-content",
              width: "100%",
              x: 0,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            onSubmit={handleUpdateTodo}
            key={todo.id + 123}
            className="flex px-2"
          >
            <input
              ref={focus}
              type="text"
              id="textupdate"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded ring-0 focus:ring-0 focus:border-0 block w-full p-2.5 "
              placeholder="Enter a Todo"
              required
            />
            <button
              type="submit"
              className={` text-white bg-teal-700 hover:scale-105 focus:scale-95 hover:border border-black transition-all duration-300 hover:bg-conic  from-red-200 to-green-700 cursor-pointer font-medium rounded text-sm px-5 py-2.5 text-center `}
            >
              UPDATE
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SingleTodo;
