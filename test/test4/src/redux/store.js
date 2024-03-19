import { configureStore } from "@reduxjs/toolkit";
import reducers from "./counterSlice.js";
export const store = configureStore({
  reducer: {
    counter: reducers,
  },
});
