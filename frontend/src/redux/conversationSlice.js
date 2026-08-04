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
    setConversationTitle: (state, action) => {
      const { title, conversationId } = action.payload;
      state.conversations = state.conversations.map((conv) => {
        return conv._id == conversationId ? { ...conv, title } : conv;
      });

      if (state.selectedConversation?._id == conversationId) {
        state.selectedConversation = { ...state.selectedConversation, title };
      }
    },
  },
});

export const {
  setConversations,
  addConversations,
  setSelectConversations,
  setConversationTitle,
} = conversationSlice.actions;
export default conversationSlice.reducer;
