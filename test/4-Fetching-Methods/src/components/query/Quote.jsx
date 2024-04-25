/* eslint-disable react/prop-types */

import getQuote from "./getQuoteAPI";
import { useQuery } from "react-query";
const Quote = () => {
  const { data } = useQuery("quote", () => getQuote());
  return (
    <div>
      <div className="container">
        <h1>Get Quotes Using fetch API</h1>
        <div>{data?.posts[0].body}</div>
      </div>
    </div>
  );
};

export default Quote;
