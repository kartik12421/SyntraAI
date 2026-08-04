import React, { useState } from "react";
import { Mic, Paperclip, Send } from "lucide-react";
import sendMessage from "../../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { createConversation } from "../../features/createConversation.js";
import getMessages from "../../features/getMessages.js";
import {
  addConversations,
  setSelectConversations,
} from "../redux/conversationSlice.js";
import {
  addMessage,
  removeMessage,
  setMessages,
} from "../redux/messageSlice.js";

function ChatInp() {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    const prompt = value.trim();
    if (!prompt || isSending) {
      return;
    }

    setIsSending(true);
    setValue("");

    let conversation = selectedConversation;
    if (!conversation?._id) {
      conversation = await createConversation();
      dispatch(addConversations(conversation));
      dispatch(setSelectConversations(conversation));
    }

    const payload = {
      prompt,
      conversationId: conversation._id,
    };

    const optimisticMessageId = `temp-user-${Date.now()}`;
    dispatch(
      addMessage({
        _id: optimisticMessageId,
        conversationId: conversation._id,
        role: "user",
        content: prompt,
        optimistic: true,
      }),
    );

    try {
      await sendMessage(payload);
      const messages = await getMessages(conversation._id);
      dispatch(setMessages(messages));
    } catch (error) {
      dispatch(removeMessage(optimisticMessageId));
      console.error("send message error:", error.message);
    } finally {
      setIsSending(false);
    }
  };
  return (
    // prompt writing field
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/6 bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/3 border border-white/7 rounded-2xl px-4 pt-3.5 pb-3">
        <textarea
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value}
          rows={2}
          placeholder="Ask me something..."
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed scrollbar-none [&::-webkit-scrollbar]:hidden disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer">
              <Paperclip />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer">
              <Mic />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!value.trim() || isSending}
            className={`flex items-center justify-center w-8 h-8 rounded-lg text-cyan-600 hover:text-purple-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer ${value.trim() ? "bg-linear-to-br from-indigo-500 to-cyan-500 hover:opacity-90 text-white" : ""}`}
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInp;
