/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    const fetchInitial = async () => {
      const data = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/test",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const res = await data.json();
      console.log(res);
    };
    fetchInitial();
  }, []);

  return <div>page</div>;
};

export default page;
