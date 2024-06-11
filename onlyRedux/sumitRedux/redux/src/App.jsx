import { useDispatch, useSelector } from "react-redux";

const App = () => {
  const counters = useSelector((state) => {
    state.counters;
  });
  const dispatch = useDispatch();
  return <div></div>;
};

export default App;
