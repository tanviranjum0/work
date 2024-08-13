import { createSlice } from "@reduxjs/toolkit";

const initial = {
  loading: false,
};
const AuthSlice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    loading: (state) => {
      state.loading = true;
    },
  },
});
export const { loading } = AuthSlice.actions;
export default AuthSlice.reducer;
