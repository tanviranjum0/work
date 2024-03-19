import { useContext } from "react";
import { counterContext } from "../store/ContextStore.js";

const Component1 = () => {
  const count = useContext(counterContext);
  return <div>Count Value is : {count}</div>;
};

export default Component1;
