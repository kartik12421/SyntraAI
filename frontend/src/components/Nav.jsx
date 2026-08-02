import React from "react";
import { MessageSquareCheck } from "lucide-react";
import { useSelector } from "react-redux";

function Nav() {
  const { selectedConversation } = useSelector((state) => state.conversation);

  return (
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
      <div></div>
    </div>
  );
}

export default Nav;
