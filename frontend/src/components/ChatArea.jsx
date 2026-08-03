import React, { useEffect } from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInp from "./ChatInp";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../../features/getMessages.js";
import { setMessages } from "../redux/messageSlice.js";

function ChatArea() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMessage = async (params) => {
      if (selectedConversation) {
        const data = await getMessages(selectedConversation?._id);
        dispatch(setMessages(data));
      }
    };

    getMessage()
  }, [selectedConversation]);
  return (
    <div className="flex min-w-0 flex-1 flex-col h-screen">
      <Nav />
      <MessageList />
      <ChatInp />
    </div>
  );
}

export default ChatArea;
