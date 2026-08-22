import { useEffect, useMemo, useState } from "react";
import {
  CodeIcon,
  File,
  FileText,
  GlobeIcon,
  Image,
  MessageCircleIcon,
  Mic,
  Paperclip,
  Presentation,
  Send,
  X,
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
import { getCurrentUser } from "../../features/getCurrentUser.js";
import { setUserData } from "../redux/userSlice.js";
import { useRef } from "react";

function ChatInp() {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const [value, setValue] = useState("");
  const [selectedAgents, setSelectedAgents] = useState("auto");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);
  const imagePreviewUrl = useMemo(() => {
    if (!selectedFile?.type.startsWith("image/")) {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

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

      const formData = new FormData();
      formData.append("prompt", value.trim());
      formData.append("conversationId", conversation?._id);
      formData.append("agent", selectedAgents);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      optimisticMessageId = `temp-user-${Date.now()}`;
      dispatch(
        addMessage({
          _id: optimisticMessageId,
          conversationId: conversation?._id,
          role: "user",
          content: prompt,
          optimistic: true,
        }),
      );

      const data = await sendMessage(formData);
      dispatch(setArtifacts(data.artifacts || []));
      const messages = await getMessages(conversation._id);
      dispatch(setMessages(messages));
      try {
        const currentUser = await getCurrentUser();
        dispatch(setUserData(currentUser));
      } catch (error) {
        console.error("refresh user error:", error.message);
      }
    } catch (error) {
      if (optimisticMessageId) {
        dispatch(removeMessage(optimisticMessageId));
      }
      setValue(prompt);
      console.error("send message error:", error.message);
    } finally {
      setIsSending(false);
      setSelectedFile(null);
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
        <div className="flex w-full gap-2 flex-wrap">
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

        {selectedFile && (
          <div className="my-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-3 max-w-full">
              {selectedFile?.type === "application/pdf" ? (
                <FileText size={16} className="text-purple-400 shrink-0" />
              ) : (
                selectedFile.type.startsWith("image/") && (
                  <img
                    src={imagePreviewUrl}
                    alt="Selected file preview"
                    className="text-cyan-300 h-10 w-10 rounded-xl object-cover shrink-0"
                  />
                )
              )}
              <div className="min-w-0">
                <p className="text-xs text-white truncate">
                  {selectedFile?.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {Math.ceil(selectedFile.size / 1024)}KB
                </p>
              </div>
              <button
                type="button"
                aria-label="Remove selected file"
                className="ml-2 flex h-8 w-8 items-center justify-center"
                onClick={() => setSelectedFile(null)}
              >
                <X className="text-slate-400 hover:text-white" />
              </button>
            </div>
          </div>
        )}

        {/* textarea */}
        <textarea
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          value={value}
          rows={2}
          placeholder="Ask Anything..."
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed scrollbar-none [&::-webkit-scrollbar]:hidden disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <input
              type="file"
              accept=".pdf,image/*"
              hidden
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                }
                e.target.value = "";
              }}
            />

            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer"
              onClick={() => {
                fileRef.current.click();
              }}
            >
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
