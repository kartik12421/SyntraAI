import React, { useEffect } from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInp from "./ChatInp";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../../features/getMessages.js";
import { clearMessages, mergeFetchedMessages } from "../redux/messageSlice.js";

function ChatArea() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMessage = async () => {
      try {
        if (selectedConversation?._id) {
          const data = await getMessages(selectedConversation._id);
          dispatch(mergeFetchedMessages(data));
          return;
        }

        dispatch(clearMessages());
      } catch (error) {
        console.error("get messages error:", error.message);
      }
    };

    getMessage();
  }, [dispatch, selectedConversation]);

  return (
    <div className="flex min-w-0 flex-1 flex-col h-screen">
      <Nav />
      <MessageList />
      <ChatInp />
    </div>
  );
}

export default ChatArea;
