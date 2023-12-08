import { configureStore } from "@reduxjs/toolkit";

import reload from "./reload";
import alert from "./alert";
export const store = configureStore({
  reducer: {
    reload: reload,
    alert: alert,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
