import { createSlice } from "@reduxjs/toolkit";
const initial = [
  { id: 1, value: 0 },
  { id: 2, value: 0 },
];
const counterSlice = createSlice({
  name: "counters",
  initial,
  reducers: {
    increment: (state, action) => {
      const counterIndex = state.findIndex((c) => c.id === action.payload);
      state[counterIndex].value++;
    },
    decrement: (state, action) => {
      const counterIndex = state.findIndex((c) => c.id === action.payload);
      state[counterIndex].value--;
    },
  },
});
export default counterSlice;
export const { increment, decrement } = counterSlice.reducer;
