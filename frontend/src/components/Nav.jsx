import React from "react";
import { MessageSquareCheck } from "lucide-react";
import { useSelector } from "react-redux";

function Nav() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  return (
    <>
      {/* Navbar in conversation */}

      {selectedConversation && (
        <div className="flex h-14 items-center justify-between gap-3 border-b border-white/6 bg-[#0d0f14] px-4 sm:px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/12 text-cyan-300">
            <MessageSquareCheck size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {selectedConversation?.title || "New Chat"}
            </p>
            <p className="text-xs text-slate-400">Chat workspace</p>
          </div>
          <div className="text-[12px] font-medium text-slate-600 bg-white/4 border rounded-full px-2 py-0.5">
            {messages?.length} Messages
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;
