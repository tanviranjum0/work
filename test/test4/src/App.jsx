import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "./features/counters/counterSlice";

const App = () => {
  const counter = useSelector((state) => state.counters);
  const dispatch = useDispatch();
  const handleIncrement = () => {
    dispatch(increment());
  };
  const handleDecrement = () => {
    dispatch(decrement());
  };
  return (
    <div className="shadow-lg h3 text-center fw-bold mt-5">
      <div className="h2">{counter}</div>
      <div onClick={handleIncrement} className="btn btn-warning m-2">
        Increment
      </div>
      <div onClick={handleDecrement} className="btn btn-warning m-2">
        Decrement
      </div>
      <div className="h2">{counter}</div>
      <div onClick={handleIncrement} className="btn btn-warning m-2">
        Increment
      </div>
      <div onClick={handleDecrement} className="btn btn-warning m-2">
        Decrement
      </div>
    </div>
  );
};

export default App;
