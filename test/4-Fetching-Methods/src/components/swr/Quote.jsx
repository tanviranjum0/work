import useSWR from "swr";
const fetcher = async (...args) => {
  const res = await fetch(...args);
  const data = await res.json();
  return data;
};
const Quote = () => {
  const { data, error } = useSWR(
    "http://127.0.0.1:5500/localServerCheck/placeholder.json",
    fetcher,
    { suspense: true }
  );
  if (error) {
    return <h1>There is an error</h1>;
  }
  // console.log(data);
  return (
    <div>
      <div className="container">
        <h1>Get Quotes Using fetch API</h1>
        <div>{data.posts[8].body}</div>
      </div>
    </div>
  );
};

export default Quote;
