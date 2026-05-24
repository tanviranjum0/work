import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counters/counterSlice";
import postsReducer from "../features/posts/postSlice";

const store = configureStore({
  reducer: {
    counters: counterReducer,
    posts: postsReducer,
  },
});

export default store;
