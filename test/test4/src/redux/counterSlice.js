import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: 0,
};
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      console.log("clickd");
      state.value = state.value + 1;
    },
    decrement: (state) => {
      state.value = state.value - 1;
    },
    multiply: (state, action) => {
      state.value = state.value * action.payload;
    },
    division: (state, action) => {
      state.value = state.value / action.payload;
    },
  },
});

export const { increment, decrement, multiply, division } =
  counterSlice.actions;
export default counterSlice.reducer;
