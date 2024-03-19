import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, multiply, division } from "./redux/counterSlice";
const App = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div className="text-center container border w-50">
      <div className="h2">Basic calculator using Redux</div>
      <input
        type="text"
        disabled
        className="w-75 text-center display"
        value={count}
      />
      <div className="buttons">
        <div
          onClick={() => dispatch(increment())}
          className="btn btn-primary m-2 w-45"
        >
          Increment +{" "}
        </div>
        <div
          onClick={() => dispatch(decrement())}
          className="btn btn-primary m-2 w-45 "
        >
          Decrement -{" "}
        </div>
        <div
          onClick={() => dispatch(multiply(5))}
          className="btn btn-primary m-2 w-45 "
        >
          Multiply *{" "}
        </div>
        <div
          onClick={() => dispatch(division(5))}
          className="btn btn-primary m-2 w-45 "
        >
          Division /{" "}
        </div>
      </div>
    </div>
  );
};

export default App;
