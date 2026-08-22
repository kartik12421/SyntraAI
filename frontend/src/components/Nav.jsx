import { CodeXml, MessageSquareCheck, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setArtifactOpen, setSidebarOpen } from "../redux/uiSlice.js";

function Nav() {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const { artifacts = [] } = useSelector((state) => state.message);

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/6 bg-[#0d0f14] px-3 sm:px-5">
      <button
        type="button"
        aria-label="Open menu"
        className="flex lg:hidden items-center justify-center h-9 w-9 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/6 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
        onClick={() => dispatch(setSidebarOpen(true))}
      >
        <Menu size={20} />
      </button>

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/12 text-cyan-300 shrink-0">
        <MessageSquareCheck size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {selectedConversation?.title || "SyntraAI"}
        </p>
        <p className="text-xs text-slate-400 truncate">
          {selectedConversation ? "Chat workspace" : "Your personal AI assistant"}
        </p>
      </div>

      {artifacts.length > 0 && (
        <button
          type="button"
          className="flex lg:hidden items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/8 transition-colors duration-150 cursor-pointer shrink-0"
          onClick={() => dispatch(setArtifactOpen(true))}
        >
          <CodeXml size={15} />
          <span className="hidden sm:inline">Code</span>
        </button>
      )}

      {selectedConversation && (
        <div className="hidden sm:block text-[12px] font-medium text-slate-600 bg-white/4 border rounded-full px-2 py-0.5 shrink-0">
          {messages?.length} Messages
        </div>
      )}
    </div>
  );
}

export default Nav;
