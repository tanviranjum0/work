import { createSlice } from "@reduxjs/toolkit";
let initialState = [
  {
    id: 1,
    value: 5,
  },
  {
    id: 2,
    value: 9,
  },
];
const counterSlice = createSlice({
  name: "counters",
  initialState,
  reducers: {
    increment: (state, action) => {
      const counterIndex = state.findIndex((c) => c.id === action.payload);
      return state[counterIndex].value++;
    },
    decrement: (state, action) => {
      const counterIndex = state.findIndex((c) => c.id === action.payload);
      return state[counterIndex].value--;
    },
  },
});
export default counterSlice.reducer;
export const { increment, decrement } = counterSlice.actions;
