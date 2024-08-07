import { configureStore } from "@reduxjs/toolkit";
import slice1 from "./Slices/slice1";

const store = configureStore({
  reducer: {
    slice: slice1,
  },
});
export default store;
