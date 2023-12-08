import { createSlice } from "@reduxjs/toolkit";
import { alertType } from "../../types/type";
const alert = createSlice({
  name: "alertComponent",
  initialState: {
    alert: { show: false } as alertType,
  },
  reducers: {
    setAlert: (state, action: {payload: alertType}) => {
      state.alert = { ...state.alert, ...action.payload };
    },
  },
});
export const setAlert = alert.actions.setAlert;
export default alert.reducer;
