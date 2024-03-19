import useCounter from "./useCounter";
import Counter2 from "./Counter2";
const App = () => {
  const [count, increment, decrement] = useCounter();
  return (
    <div className="text-center">
      <div className="h3">{count} </div>
      <button onClick={() => increment()} className="btn btn-info">
        Increment
      </button>
      <button onClick={() => decrement()} className="btn btn-info">
        Decrement
      </button>
      <Counter2 />
    </div>
  );
};

export default App;
