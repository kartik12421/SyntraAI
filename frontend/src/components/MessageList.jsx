import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";

function MessageList() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, isGenerating } = useSelector((state) => state.message);
  const showEmptyState = !selectedConversation || messages.length === 0;
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || showEmptyState) {
      return;
    }

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, selectedConversation, showEmptyState, isGenerating]);

  return (
    // no messages selected screen
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 sm:py-7 space-y-5 [scrollbar-width:hidden] [&::-webkit-scrollbar]:hidden"
    >
      {showEmptyState ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5 max-w-xl">
            <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-tight text-cyan-400">
              SyntraAI
            </h1>
            <p className="text-base sm:text-[20px] font-semibold tracking-tight text-slate-400">
              Your personal AI assistant, how may I help you?
            </p>
            <p className="text-base sm:text-[20px] font-semibold tracking-tight text-slate-300">
              I can help you with ideas, code, pdf, ppt, image, and searching on
              web.
            </p>
          </div>
          {/* buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {[
              "Build a dashboard",
              "Create a image of a puppy",
              "Write a summary note on a topic",
            ].map((s) => (
              <button
                key={s}
                className="text-[12px] text-slate-400 bg-white/4 border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/8 hover:text-slate-200 transition-colors duration-150 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages?.map((msg, i) => {
            return (
              // message Bubbles
              <div key={msg?._id || `${msg?.role}-${i}`}>
                <MessageBubble
                  role={msg?.role}
                  content={msg?.content}
                  images={msg?.images || []}
                />
              </div>
            );
          })}
          {isGenerating && <Loader />}
        </div>
      )}
    </div>
  );
}

export default MessageList;
