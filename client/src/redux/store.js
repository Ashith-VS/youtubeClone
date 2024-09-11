import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import commonReducer from "./slice/commonSlice";
import videoReducer from "./slice/videoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    common:commonReducer,
    video: videoReducer
  }
})
