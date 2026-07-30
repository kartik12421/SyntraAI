import React from "react";
import { PanelLeftIcon } from "lucide-react";

function Sidebar() {
  return (
    <div className="fixed lg-static inset-y-0 left-0 z-50 w-67.5 h-screen shrink-0 bg-[#0d0f14] border-r border-white/6">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/6">
          <div className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer">
            <PanelLeftIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
