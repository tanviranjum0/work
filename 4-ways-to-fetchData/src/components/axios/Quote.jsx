import { useEffect, useState } from "react";
import axios from "axios";
const Quote = () => {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    const fetchQuote = async () => {
      const res = await axios.get("https://api.quotable.io/random");
      // const data = await res.json();
      setQuote(res.data);
    };
    fetchQuote();
  }, []);
  return (
    <div>
      <h1>Get quote using FETCH Api</h1>
      <div>{quote?.content}</div>
    </div>
  );
};

export default Quote;
