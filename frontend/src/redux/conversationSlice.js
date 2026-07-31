import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation: null,
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversations: (state, action) => {
      state.conversations.unshift(action.payload);
    },
    setSelectConversations: (state, action) => {
      state.selectedConversation = action.payload;
    },
  },
});

export const { setConversations, addConversations, setSelectConversations } =
  conversationSlice.actions;
export default conversationSlice.reducer;
