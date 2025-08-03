import React, { FormEvent } from "react";
import { InputFieldProps } from "@/models/model";
const InputField = ({ setTodos }: InputFieldProps) => {
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
      }
    }
  };
  return (
    <form onSubmit={handleNewTodoAdd} className="flex">
      <input
        type="text"
        id="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
        placeholder="Enter a Todo"
        required
      />
      <button
        type="submit"
        className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
      >
        ADD
      </button>
    </form>
  );
};

export default InputField;
