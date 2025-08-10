"use client";
import React, { useEffect, useState } from "react";
import InputField from "./InputField";
import TodoList from "./TodoList";
import { Todo } from "@/models/model";
import { useTodoContext } from "./context/StoreContextMain";

const TodoApp = () => {
  var koo;
  if (typeof window !== "undefined") {
    koo = localStorage.getItem("TodoAppTodos");
  }
  const [todos, setTodos] = useState<Array<Todo>>(koo ? JSON.parse(koo!) : []);

  useEffect(() => {
    localStorage.setItem("TodoAppTodos", JSON.stringify(todos));
  }, [todos]); //

  const TodoContext = useTodoContext();

  return (
    <div className="select-none">
      <input type="text" />
      <div className="text-center text-2xl md:text-4xl py-10 bg-gradient-to-r from-pink-400 to-fuchsia-700">
        Taskify
      </div>
      <div className="h-screen w-full bg-conic from-pink-200 to-fuchsia-300">
        <div className="sm:mx-10  md:mx-20 mx-2">
          <InputField />
          <TodoList />
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
