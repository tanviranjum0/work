import React from "react";
import SingleTodo from "./SingleTodo";
import { TodoListProps } from "@/models/model";
const TodoList = ({ todos, setTodos }: TodoListProps) => {
  return (
    <div className="px-3 py-2  bg-gray-300">
      <div className="text-xl py-3">Active Tasks</div>
      <div className="flex flex-col gap-2">
        {todos.length === 0 && (
          <div className="text-center text-gray-500">No tasks available</div>
        )}
        {todos.map((todo) => {
          return <SingleTodo setTodos={setTodos} key={todo.id} todo={todo} />;
        })}
      </div>
    </div>
  );
};

export default TodoList;
