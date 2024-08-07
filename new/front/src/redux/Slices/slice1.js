import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  counter: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    increment: (state, action) => {
      state.counter = state.counter * action.payload;
    },
  },
});

export const { increment } = userSlice.actions;

export default userSlice.reducer;
