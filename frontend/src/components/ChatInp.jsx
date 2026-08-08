import React, { useState } from "react";
import {
  CodeIcon,
  File,
  GlobeIcon,
  Image,
  MessageCircleIcon,
  Mic,
  Paperclip,
  Presentation,
  Send,
  Zap,
} from "lucide-react";
import sendMessage from "../../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { createConversation } from "../../features/createConversation.js";
import getMessages from "../../features/getMessages.js";
import {
  addConversations,
  setConversationTitle,
  setSelectConversations,
} from "../redux/conversationSlice.js";
import {
  addMessage,
  removeMessage,
  setArtifacts,
  setMessages,
} from "../redux/messageSlice.js";
import { updateConversation } from "../../features/updateconversation.js";

function ChatInp() {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const [value, setValue] = useState("");
  const [selectedAgents, setSelectedAgents] = useState("auto");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    const prompt = value.trim();
    if (!prompt || isSending) {
      return;
    }

    setIsSending(true);
    setValue("");

    let optimisticMessageId;

    try {
      let conversation = selectedConversation;
      if (!conversation?._id) {
        conversation = await createConversation();
        dispatch(addConversations(conversation));
        dispatch(setSelectConversations(conversation));
      }

      if (conversation.title == "New Chat") {
        await updateConversation({ id: conversation._id, title: prompt });
        dispatch(
          setConversationTitle({
            conversationId: conversation._id,
            title: prompt.slice(0, 20),
          }),
        );
      }

      const payload = {
        prompt,
        conversationId: conversation._id,
        agent: selectedAgents,
      };

      optimisticMessageId = `temp-user-${Date.now()}`;
      dispatch(
        addMessage({
          _id: optimisticMessageId,
          conversationId: conversation._id,
          role: "user",
          content: prompt,
          optimistic: true,
        }),
      );

      const data = await sendMessage(payload);
      dispatch(setArtifacts(data.artifacts || []));
      const messages = await getMessages(conversation._id);
      dispatch(setMessages(messages));
    } catch (error) {
      if (optimisticMessageId) {
        dispatch(removeMessage(optimisticMessageId));
      }
      setValue(prompt);
      console.error("send message error:", error.message);
    } finally {
      setIsSending(false);
    }
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageCircleIcon,
      label: "Chat",
    },
    {
      id: "code",
      icon: CodeIcon,
      label: "Coding",
    },
    {
      id: "pdf",
      icon: File,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
    {
      id: "imageGen",
      icon: Image,
      label: "Image",
    },
    {
      id: "search",
      icon: GlobeIcon,
      label: "Search",
    },
  ];
  return (
    // prompt writing field
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/6 bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/3 border border-white/7 rounded-2xl px-4 pt-3.5 pb-3">
        {/* agents mapping */}
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent) => {
            const isActive = selectedAgents === agent.id;
            const Icon = agent.icon;

            return (
              <div
                key={agent.id}
                onClick={() => {
                  setSelectedAgents(agent.id);
                }}
                className={`shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all ${
                  isActive
                    ? "bg-linear-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                    : "bg-white/3 text-slate-400 border-white/6 hover:bg-white/[0.07]"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-white" : "text-slate-500"}
                />

                {agent.label}
              </div>
            );
          })}
        </div>

        {/* textarea */}
        <textarea
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value}
          rows={2}
          placeholder="Ask Anything..."
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
