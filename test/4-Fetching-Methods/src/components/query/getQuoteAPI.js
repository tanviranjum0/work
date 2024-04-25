const getQuote = async () => {
  const res = await fetch(
    "http://127.0.0.1:5500/localServerCheck/placeholder.json"
  );
  const response = await res.json();
  return response;
};
export default getQuote;
