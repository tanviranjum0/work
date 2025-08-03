import { MdEdit } from "react-icons/md";
import { useState } from "react";
import { IoMdDoneAll } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { SingleTodoProps } from "@/models/model";
const SingleTodo = ({ todo, setTodos }: SingleTodoProps) => {
  const [edit, setEdit] = useState(false);
  const handleDelete = () => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
  };
  const handleDone = () => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, isDone: !t.isDone } : t))
    );
  };
  const handleToggleEdit = () => {
    setEdit((prev) => !prev);
  };
  const handleUpdateTodo = () => {
    setEdit(false);
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
  };
  return (
    <div>
      <div className="flex justify-between bg-teal-100 py-2 px-3 rounded ">
        <div className={`text-lg ${todo.isDone ? "line-through" : ""}`}>
          {todo.todo}
        </div>
        <div className="flex gap-4 py-2 text-bold text-xl">
          <button
            onClick={handleToggleEdit}
            className="cursor-pointer hover:scale-110 transition-all duration-200"
          >
            <MdEdit />
          </button>
          <button
            onClick={handleDone}
            className="cursor-pointer hover:scale-110 transition-all duration-200"
          >
            <IoMdDoneAll />
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer hover:scale-110 transition-all duration-200"
          >
            <MdDelete />
          </button>
        </div>
      </div>
      {edit && (
        <form onSubmit={handleUpdateTodo} className="flex">
          <input
            type="text"
            id="textupdate"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
            placeholder="Enter a Todo"
            required
          />
          <button
            type="submit"
            className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          >
            UPDATE
          </button>
        </form>
      )}
    </div>
  );
};

export default SingleTodo;
