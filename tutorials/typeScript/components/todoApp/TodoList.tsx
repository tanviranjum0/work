"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import SingleTodo from "./SingleTodo";
import { TodoListProps } from "@/models/model";
const TodoList = ({ todos, setTodos }: TodoListProps) => {
  return (
    <div className="px-3 py-2  bg-gray-300">
      {todos?.length !== 0 && <div className="text-xl py-3">Active Tasks</div>}

      <div className="flex flex-col  gap-2">
        {todos?.length === 0 && (
          <div className="text-center text-gray-500">No tasks available</div>
        )}
        <AnimatePresence>
          {todos?.map((todo) => (
            <motion.div
              key={todo.id + 234}
              initial={{
                height: 0,
                width: 0,
                x: "50vw",
                opacity: 0.7,
              }}
              animate={{
                height: "100%",
                width: "100%",
                x: 0,
                opacity: 1,
                transition: {
                  duration: 0.5,
                },
              }}
              exit={{
                height: 0,
                width: 0,
                opacity: 0.7,

                x: "50%",
              }}
              transition={{
                duration: 1.5,
              }}
            >
              <SingleTodo
                todos={todos}
                setTodos={setTodos}
                key={todo.id}
                todo={todo}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TodoList;
