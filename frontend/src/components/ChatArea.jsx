import React from "react";
import Nav from "./NAv";
import MessageList from "./MessageList";
import ChatInp from "./ChatInp";

function ChatArea() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <MessageList />
      <ChatInp />
    </div>
  );
}

export default ChatArea;
