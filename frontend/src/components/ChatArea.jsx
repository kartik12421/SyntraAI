import React from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInp from "./ChatInp";

function ChatArea() {
  return (
    <div className="flex min-w-0 flex-1 flex-col h-screen">
      <Nav />
      <MessageList />
      <ChatInp />
    </div>
  );
}

export default ChatArea;
