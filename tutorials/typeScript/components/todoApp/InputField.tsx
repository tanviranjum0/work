import React, { FormEvent } from "react";
import { InputFieldProps } from "@/models/model";
const InputField = ({ setTodos, todos }: InputFieldProps) => {
  const handleNewTodoAdd = (e: FormEvent) => {
    e.preventDefault();
    const text = document.getElementById("text") as HTMLInputElement | null;
    if (text && text instanceof HTMLInputElement) {
      const todoText = text.value.trim();
      if (todoText) {
        setTodos((prevTodos) => [
          ...prevTodos,
          { id: Date.now(), todo: todoText, isDone: false },
        ]);
        text.value = ""; // Clear the input field after adding
        localStorage.setItem("TodoAppTodos", JSON.stringify(todos));
      }
    }
  };
  return (
    <form
      onSubmit={handleNewTodoAdd}
      className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 "
    >
      <input
        type="text"
        id="text"
        className="bg-gray-200 border col-span-4 sm:col-span-6 md:col-span-9 border-gray-300 text-gray-900 text-sm rounded ring-0 focus:border-0  w-full p-2.5 "
        placeholder="Enter a Todo"
        required
      />
      <button
        type="submit"
        className="text-white col-span-2 md:col-span-1 cursor-pointer bg-teal-700  hover:scale-105 focus:scale-95 hover:border border-black transition-all duration-300 hover:bg-conic  from-red-200 to-green-700  font-medium rounded text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
      >
        ADD
      </button>
    </form>
  );
};

export default InputField;
