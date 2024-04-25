import { configureStore } from "@reduxjs/toolkit";
import countersReducer from "../features/counters/counterSlice";
const store = configureStore({
  reducer: {
    counters: countersReducer,
  },
});
export default store;
