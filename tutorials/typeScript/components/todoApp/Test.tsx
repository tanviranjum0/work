"use client";
import React, { useState } from "react";
import InputField from "./InputField";
import TodoList from "./TodoList";
import { Todo } from "@/models/model";

const Test = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);

  return (
    <div className="select-none">
      <div className=" text-center text-4xl py-10 bg-gradient-to-r from-pink-400 to-fuchsia-700">
        Taskify
      </div>
      <div className="h-screen w-full bg-conic from-pink-200 to-fuchsia-300">
        <div className=" mx-20 ">
          <InputField setTodos={setTodos} />
          <TodoList setTodos={setTodos} todos={todos} />
        </div>
      </div>
    </div>
  );
};

export default Test;
