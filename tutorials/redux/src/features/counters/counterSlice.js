import { createSlice } from "@reduxjs/toolkit";
const counterSlice = createSlice({
  name: "counters",
  initialState: [
    {
      id: 1,
      count: 0,
    },
    {
      id: 2,
      count: 0,
    },
  ],
  reducers: {
    increment: (state, action) => {
      const counter = state.findIndex(
        (counter) => counter.id === action.payload,
      );
      state[counter].count += 1;
    },
    decrement: (state, action) => {
      const counter = state.findIndex(
        (counter) => counter.id === action.payload,
      );
      state[counter].count -= 1;
    },
    incrementByValue: (state, action) => {
      const counter = state.findIndex(
        (counter) => counter.id === action.payload.id,
      );
      state[counter].count += action.payload.value;
    },
  },
});

export default counterSlice.reducer;
export const { increment, decrement } = counterSlice.actions;
