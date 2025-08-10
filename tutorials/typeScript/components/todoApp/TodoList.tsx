import React, { Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import SingleTodo from "./SingleTodo";
import { useTodoContext } from "./context/StoreContextMain";
const TodoList = () => {
  const TodoContext = useTodoContext();
  return (
    <div className="px-3 py-2  bg-gray-300">
      <div className="sm:text-lg text-center md:text-xl py-3">Active Tasks</div>
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          <Suspense fallback={<p>Loading...</p>}>
            {TodoContext.todos?.map((todo) => (
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
                <SingleTodo todo={todo} />
              </motion.div>
            ))}
          </Suspense>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TodoList;
