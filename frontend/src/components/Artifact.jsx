import React, { useState } from "react";
import { Code, PanelRight } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

function Artifact() {
  const [collapsed, setCollapsed] = useState(false);
  const { artifacts = [] } = useSelector((state) => state.message);

  if (artifacts.length == 0) return;
  return (
    <motion.div
      initial={{}}
      animate={{}}
      transition={{}}
      className="hidden lg:flex h-full border border-white/6 flex-col overflow-hidden shrink-0 w-62.5"
    >
      <div className="flex flex-col h-full bg-[#0d0f14]">
        <div className="h-14 px-4 border-b border-white/6 flex items-center gap-3 shrink-0">
          <button
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            <PanelRight />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
              <Code className="text-cyan-400" />
            </div>
            <div className="text-[16px] font-medium text-slate-400 truncate">
              {artifacts[0]?.title}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Artifact;
