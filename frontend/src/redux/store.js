import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import conversationReducer from "./conversationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
  },
});
