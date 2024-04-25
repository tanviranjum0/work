import { useReducer } from "react";

const App = () => {
  function reducer(state, action) {
    if (action.type === "inc") {
      return {
        // ...state,
        count: state.count + 1,
      };
    } else if (action.type === "dec") {
      return {
        // ...state,
        count: state.count - 1,
      };
    }
  }
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <div className="text-center">
      <div className="h2">{state.count}</div>
      <button
        onClick={() => dispatch({ type: "inc" })}
        className="btn btn-primary"
      >
        INC
      </button>
      <button
        onClick={() => dispatch({ type: "dec" })}
        className="btn btn-primary"
      >
        DEC
      </button>
    </div>
  );
};

export default App;
