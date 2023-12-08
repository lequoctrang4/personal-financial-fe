import { createSlice } from "@reduxjs/toolkit";

const reLoad = createSlice({
  name: "ReloadGlobal",
  initialState: {
    reload: true,
  },
  reducers: {
    setReload: (state) => {
      console.log(state.reload);
      state.reload = !state.reload;
    },
  },
});
export const setReload = reLoad.actions.setReload;
export default reLoad.reducer;
