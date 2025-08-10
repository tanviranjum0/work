"use client";
import StoreContextMain from "@/components/todoApp/context/StoreContextMain";
import ReactResponsive from "@/components/todoApp/ReactResponsive";
import TodoApp from "@/components/todoApp/TodoApp";
import React from "react";

const page = () => {
  return (
    <div>
      <StoreContextMain>
        <TodoApp />
      </StoreContextMain>
      {/* <ReactResponsive /> */}
    </div>
  );
};

export default page;
