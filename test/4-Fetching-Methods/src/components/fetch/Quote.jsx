import { useEffect, useState } from "react";
const Quote = () => {
  const [quote, setquote] = useState(null);
  useEffect(() => {
    const fetchQuote = async () => {
      const res = await fetch(
        "http://127.0.0.1:5500/localServerCheck/placeholder.json"
      );
      const data = await res.json();
      setquote(data);
    };
    fetchQuote();
  }, []);
  return (
    <div>
      <div className="container">
        <h1>Get Quotes Using fetch API</h1>
        <div>{quote?.posts[0].body}</div>
      </div>
    </div>
  );
};

export default Quote;
