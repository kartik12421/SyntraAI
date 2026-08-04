import React from "react";
import { Mic, Paperclip, Send } from "lucide-react";

function ChatInp() {
  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/6 bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/3 border border-white/7 rounded-2xl px-4 pt-3.5 pb-3">
        <textarea
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
          <button className="flex items-center justify-center w-8 h-8 rounded-lg text-cyan-600 hover:text-purple-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer">
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInp;
