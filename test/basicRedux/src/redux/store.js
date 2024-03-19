import { configureStore } from "@reduxjs/toolkit";
import reducers from "./counterSlice";
export const store = configureStore({
  reducer: {
    counter: reducers,
  },
});
