import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  multiply,
  incrementByAmmount,
} from "./redux/counterSlice";

const App = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <div className="h2">This is Redux Course</div>
      <hr />
      <Navbar> </Navbar>
      <div> current value :{count}</div>
      <button
        onClick={() => dispatch(increment())}
        className="btn m-2 btn-primary"
      >
        Increment
      </button>
      <button
        onClick={() => dispatch(decrement())}
        className="btn m-2 btn-primary"
      >
        Decrement
      </button>
      <button
        onClick={() => dispatch(multiply())}
        className="btn m-2 btn-primary"
      >
        *
      </button>
      <button
        onClick={() => dispatch(incrementByAmmount(2))}
        className="btn m-2 btn-primary"
      >
        2
      </button>
    </div>
  );
};

export default App;
