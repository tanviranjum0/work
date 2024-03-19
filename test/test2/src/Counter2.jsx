import useCounter from "./useCounter";
const Counter2 = () => {
  const [count, increment, decrement] = useCounter(7);

  return (
    <div className="text-center">
      <div className="h3">{count} </div>
      <button onClick={() => increment()} className="btn btn-info">
        Increment
      </button>
      <button onClick={() => decrement()} className="btn btn-info">
        Decrement
      </button>
    </div>
  );
};

export default Counter2;
