import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    mergeFetchedMessages: (state, action) => {
      const fetchedMessages = action.payload;
      const optimisticMessages = state.messages.filter(
        (message) => message.optimistic,
      );

      state.messages = [
        ...fetchedMessages,
        ...optimisticMessages.filter((optimisticMessage) => {
          return !fetchedMessages.some(
            (message) =>
              message.role === optimisticMessage.role &&
              message.content === optimisticMessage.content,
          );
        }),
      ];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message._id !== action.payload,
      );
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setMessages,
  mergeFetchedMessages,
  addMessage,
  removeMessage,
  clearMessages,
} = messageSlice.actions;
export default messageSlice.reducer;
