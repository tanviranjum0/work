const redux = require("redux");
const initialValue = {
  counter: 0,
};
const reducer = (store = initialValue, action) => {
  let newStore = store;
  switch (action.type) {
    case "DECREMENT":
      newStore = { counter: store.counter - 1 };
      break;
    case "INCREMENT":
      newStore = { counter: store.counter + 1 };
      break;
    case "ADDITION":
      newStore = { counter: store.counter + action.payload.number };
      break;
    default:
      return newStore;
  }
  return newStore;
};
const store = redux.createStore(reducer);
const subscriber = () => {
  const state = store.getState();
  console.log(state);
};
store.subscribe(subscriber);
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "ADDITION", payload: { number: 7 } });
store.dispatch({ type: "DECREMENT" });
store.dispatch({ type: "INCREMENT" });
