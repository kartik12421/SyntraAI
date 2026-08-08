import React, { useEffect } from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInp from "./ChatInp";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../../features/getMessages.js";
import {
  clearMessages,
  mergeFetchedMessages,
  setArtifacts,
} from "../redux/messageSlice.js";

function ChatArea() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMessage = async () => {
      try {
        if (selectedConversation?._id) {
          if (selectedConversation.title == "New Chat") {
            dispatch(clearMessages());
            dispatch(setArtifacts([]));
            return;
          }
          const data = await getMessages(selectedConversation._id);
          dispatch(mergeFetchedMessages(data));
          let latestArtifactMessage = [...data]
            .reverse()
            .find((msg) => msg.artifacts?.length > 0);
          dispatch(setArtifacts(latestArtifactMessage?.artifacts || []));
          return;
        }

        dispatch(clearMessages());
        dispatch(setArtifacts([]));
      } catch (error) {
        console.error("get messages error:", error.message);
      }
    };

    getMessage();
  }, [dispatch, selectedConversation?._id]);

  return (
    <div className="flex min-w-0 flex-1 flex-col h-screen">
      <Nav />
      <MessageList />
      <ChatInp />
    </div>
  );
}

export default ChatArea;
