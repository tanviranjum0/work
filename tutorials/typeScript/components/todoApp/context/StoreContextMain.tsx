"use client";
import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  FormEvent,
} from "react";

import { Todo } from "@/models/model";

interface TodoAppContextType {
  todos: Array<Todo>;
  setTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>;
  handleNewTodoAdd: (e: React.FormEvent) => void;
}
interface StoreContextType {
  children: React.ReactNode;
}
const TodoContext = createContext<TodoAppContextType>(null!);

const StoreContextMain = ({ children }: StoreContextType) => {
  var koo;
  if (typeof window !== "undefined") {
    koo = localStorage.getItem("TodoAppTodos");
  }
  const [todos, setTodos] = useState<Array<Todo>>(koo ? JSON.parse(koo!) : []);

  useEffect(() => {
    localStorage.setItem("TodoAppTodos", JSON.stringify(todos));
  }, [todos]); //

  const handleNewTodoAdd = (e: React.FormEvent) => {
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
  const values: TodoAppContextType = {
    todos,
    setTodos,
    handleNewTodoAdd,
  };
  return <TodoContext.Provider value={values}>{children}</TodoContext.Provider>;
};
export const useTodoContext = () => {
  return useContext(TodoContext);
};
export default StoreContextMain;
