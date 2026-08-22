import { useEffect, useState } from "react";
import {
  Check,
  Code,
  CodeXmlIcon,
  Copy,
  EyeDashed,
  PanelLeft,
  PanelRight,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { easeInOut, motion } from "motion/react";
import Editor from "@monaco-editor/react";
import copyToClipboard from "../../features/copyToClipboard";
import { setArtifactOpen } from "../redux/uiSlice.js";

function Artifact() {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );
  const dispatch = useDispatch();
  const { artifacts = [] } = useSelector((state) => state.message);
  const { artifactOpen } = useSelector((state) => state.ui);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event) => setIsDesktop(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isDesktop && artifacts.length === 0) {
      dispatch(setArtifactOpen(false));
    }
  }, [artifacts.length, dispatch, isDesktop]);

  const handleCopy = async () => {
    await copyToClipboard(file?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (artifacts.length === 0) return null;
  if (!isDesktop && !artifactOpen) return null;

  const file = artifacts[0]?.files[activeFile];
  const htmlfile = artifacts[0]?.files?.find((f) => f.name === "index.html");
  const cssfile = artifacts[0]?.files?.find((f) => f.name === "style.css");
  const jsfile = artifacts[0]?.files?.find((f) => f.name === "script.js");

  const canPreview = Boolean(htmlfile);

  const previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      ${cssfile?.content || ""}
    </style>
</head>
<body>
    ${htmlfile?.content || ""}
    <style>
        ${jsfile?.content || ""}
    </style>
</body>
</html>
  `;

  const detectLang = (fileName = "") => {
    const name = fileName.toLowerCase();

    if (name.endsWith(".html")) {
      return "html";
    }
    if (name.endsWith(".css")) {
      return "css";
    }
    if (name.endsWith(".js")) {
      return "javascript";
    }
    if (name.endsWith(".jsx")) {
      return "javascript";
    }
    if (name.endsWith(".ts")) {
      return "typescript";
    }
    if (name.endsWith(".tsx")) {
      return "typescript";
    }
    if (name.endsWith(".py")) {
      return "python";
    }
    if (name.endsWith(".c")) {
      return "c";
    }
    if (name.endsWith(".cpp")) {
      return "cpp";
    }
    if (name.endsWith(".java")) {
      return "java";
    }

    return "planetext";
  };

  const toggleButton = isDesktop ? (
    collapsed ? (
      <PanelLeft />
    ) : (
      <PanelRight />
    )
  ) : (
    <X />
  );

  const header = (
    <div className="h-14 px-3 sm:px-4 border-b border-white/6 flex items-center gap-2 sm:gap-3 shrink-0">
      <button
        type="button"
        aria-label={isDesktop ? "Toggle panel" : "Close code"}
        className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
        onClick={() =>
          isDesktop
            ? setCollapsed((prev) => !prev)
            : dispatch(setArtifactOpen(false))
        }
      >
        {toggleButton}
      </button>
      {!collapsed && (
        <>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
              <Code size={14} className="text-cyan-400" />
            </div>
            <div className="text-[15px] font-medium text-slate-400 truncate">
              {artifacts[0]?.title}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCopy}
                title="Copy code"
                aria-label="Copy code"
                className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer"
              >
                {copied ? <Check className="text-cyan-400" /> : <Copy />}
              </button>
            </div>
          </div>
          {canPreview && (
            <div className="flex items-center gap-1 bg-white/4 border border-white/6 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 ${
                  tab === "code"
                    ? "bg-cyan-500 text-white"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                <CodeXmlIcon size={13} /> Code
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 ${
                  tab === "preview"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                <EyeDashed size={13} /> Preview
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  const body = (
    <>
      {tab == "code" && !collapsed && (
        <div className="flex min-w-0 border-b border-white/6 overflow-x-auto no-scrollbar shrink-0">
          {artifacts[0]?.files?.map((f, index) => (
            <button
              key={f?.name ?? index}
              onClick={() => setActiveFile(index)}
              className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/5 relative cursor-pointer bg-transparent hover:bg-white/5 shrink-0 ${
                activeFile === index
                  ? "text-cyan-400 hover:text-cyan-300"
                  : "text-slate-500 hover:text-slate-200"
              }`}
            >
              {f?.name}
              {activeFile === index && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {tab === "preview" && canPreview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <iframe
              title="preview"
              srcDoc={previewDoc}
              className="w-full h-full bg-white"
              sandbox="allow-scripts"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            <Editor
              theme="vs-dark"
              language={detectLang(file?.name)}
              value={file?.content}
              height="100%"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                lineNumbers: "on",
                renderLineHighlight: "none",
              }}
            />
          </motion.div>
        )}
      </div>
    </>
  );

  if (!isDesktop) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-[#0d0f14]"
      >
        {header}
        {body}
      </motion.div>
    );
  }

  if (collapsed) {
    return (
      <motion.div
        initial={{ width: 400 }}
        animate={{ width: 53 }}
        transition={{ duration: 0.5, ease: easeInOut }}
        className="hidden lg:flex h-full border-l border-white/6 flex-col overflow-hidden shrink-0 w-13.25"
      >
        <div className="flex flex-col h-full bg-[#0d0f14]">
          {header}
          <div className="flex h-auto items-center justify-center px-2 py-4 text-center flex-1 min-w-0">
            <div
              className="relative text-[11px] font-medium tracking-widest uppercase text-slate-400 hover:text-slate-200 truncate"
              style={{ writingMode: "vertical-lr" }}
              title={artifacts[0]?.title}
            >
              {artifacts[0]?.title || "Artifact"}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 400 }}
      animate={{ width: 400 }}
      transition={{ duration: 0.5, ease: easeInOut }}
      className="hidden lg:flex h-full border-l border-white/6 flex-col overflow-hidden shrink-0"
    >
      <div className="flex flex-col h-full bg-[#0d0f14]">
        {header}
        {body}
      </div>
    </motion.div>
  );
}

export default Artifact;
