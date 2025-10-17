"use client";
import StoreContextMain from "@/components/todoApp/context/StoreContextMain";
import ReactResponsive from "@/components/todoApp/ReactResponsive";
import Base34Images from "@/components/Base34Images";
import TodoApp from "@/components/todoApp/TodoApp";
import React from "react";

const page = () => {
  return (
    <div>
      {/* <StoreContextMain>
        <TodoApp />
      </StoreContextMain> */}
      {/* <ReactResponsive /> */}
      <Base34Images />
    </div>
  );
};

export default page;
