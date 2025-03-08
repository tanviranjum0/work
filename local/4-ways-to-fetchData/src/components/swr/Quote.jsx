// import { useEffect, useState, Suspence } from "react";
import useSWR from "swr";
import axios from "axios";
const fetcher = async (...arg) => {
  const data = await axios.get(...arg);
  return data;
};
const Quote = () => {
  const { data, error } = useSWR("https://api.quotable.io/random", fetcher, {
    suspence: true,
  });
  console.log(data);
  if (error) {
    return <h1>there is a error</h1>;
  }
  return (
    // <Suspence fallback={<h1>Loading....</h1>}>
    <>
      <h1>Get quote using FETCH Api</h1>
      <div>{data.content}</div>
    </>

    // </Suspence>
  );
};

export default Quote;
