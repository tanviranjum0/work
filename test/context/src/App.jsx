import Navbar from "./components/Navbar";
import { useState } from "react";
import { counterContext } from "./store/ContextStore";
function App() {
  const [count, setCount] = useState(0);
  return (
    <counterContext.Provider value={count}>
      <div className="px-4 py-5 my-5 text-center">
        <Navbar></Navbar>
        <hr />
        <h2>{count}</h2>
        <button
          className="btn btn-info rounded"
          onClick={() => setCount(count + 1)}
        >
          Increment +
        </button>
        {/* <Button></Button> */}
      </div>
    </counterContext.Provider>
  );
}
export default App;
