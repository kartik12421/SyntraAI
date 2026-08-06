import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Link } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

function MessageBubble({ role, content, images }) {
  const [copyCode, setCopyCode] = useState("");
  const isUser = role == "user";
  const hasImages = !isUser && Array.isArray(images) && images.length > 0;
  const [previewImage, setPreviewImage] = useState(null);

  const handleCopyCode = async (code) => {
    await navigator.clipboard.writeText(code);

    setCopyCode(code);
    setTimeout(() => {
      setCopyCode("");
    }, 2000);
  };

  const markdownComponents = {
    img: () => null,
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 rounded-2xl wrap-break-word overflow-hidden leading-relaxed ${
          isUser
            ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
            : "text-slate-200 rounded-tl-sm"
        }`}
      >
        {hasImages && (
          <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-3">
            {images.map((img, index) => (
              <button
                type="button"
                key={`${img}-${index}`}
                onClick={() => setPreviewImage(img)}
                className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-lg shadow-black/20 cursor-zoom-in"
              >
                <img
                  src={img}
                  alt={`generated result ${index + 1}`}
                  loading="lazy"
                  onError={(event) => event.currentTarget.remove()}
                  className="h-28 w-full object-cover transition-transform duration-150 hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
        )}
        {content ? (
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Headings
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
              ),

              h2: ({ children }) => (
                <h2 className="text-3xl font-semibold mt-7 mb-3">{children}</h2>
              ),

              h3: ({ children }) => (
                <h3 className="text-2xl font-semibold mt-6 mb-3">{children}</h3>
              ),

              h4: ({ children }) => (
                <h4 className="text-xl font-semibold mt-5 mb-2">{children}</h4>
              ),

              h5: ({ children }) => (
                <h5 className="text-lg font-semibold mt-4 mb-2">{children}</h5>
              ),

              h6: ({ children }) => (
                <h6 className="text-base font-semibold mt-4 mb-2 uppercase tracking-wide text-gray-400">
                  {children}
                </h6>
              ),

              // Paragraph
              p: ({ children }) => (
                <p className="leading-7 my-3 whitespace-pre-wrap wrap-break-word">
                  {children}
                </p>
              ),

              // Links
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-blue-300 underline underline-offset-4"
                >
                  <Link size={16} className="shrink-0" />
                  <span>{children}</span>
                </a>
              ),

              // Bold
              strong: ({ children }) => (
                <strong className="font-bold text-white">{children}</strong>
              ),

              // Italic
              em: ({ children }) => (
                <em className="italic text-gray-200">{children}</em>
              ),

              // Strike
              del: ({ children }) => (
                <del className="line-through text-gray-500">{children}</del>
              ),

              // Lists
              ul: ({ children }) => (
                <ul className="list-disc pl-6 my-3 space-y-2">{children}</ul>
              ),

              ol: ({ children }) => (
                <ol className="list-decimal pl-6 my-3 space-y-2">{children}</ol>
              ),

              li: ({ children }) => <li className="leading-7">{children}</li>,

              // Horizontal Line
              hr: () => <hr className="my-6 border-white/20" />,

              // Blockquote
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 bg-white/5 pl-4 py-2 my-4 italic rounded-r-lg">
                  {children}
                </blockquote>
              ),

              // Inline Code
              code({ className, children }) {
                const language = className?.replace("language-", "");
                const isBlockCode = Boolean(className);
                const value = isBlockCode
                  ? String(children).replace(/\n$/, "")
                  : String(children).trim();

                if (!className) {
                  return (
                    <code className="text-purple-400 bg-white/10 px-2 py-1 rounded">
                      {value}
                    </code>
                  );
                }

                return (
                  <div className="my-4 overflow-hidden rounded-xl border border-white/20 bg-[#0d1117]">
                    <div className="flex items-center justify-between bg-[#161b22] border-b border-white/10 px-4 py-2">
                      <span className="uppercase text-xs text-slate-400">
                        {language || "text"}
                      </span>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs"
                        onClick={() => handleCopyCode(value)}
                      >
                        {copyCode === value ? (
                          <>
                            {" "}
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    <SyntaxHighlighter
                      language={language}
                      style={vscDarkPlus}
                      showLineNumbers
                      wrapLines={false}
                      lineNumberStyle={{
                        minWidth: "2.25em",
                        paddingRight: "1em",
                        color: "#6b7280",
                        userSelect: "none",
                      }}
                      customStyle={{
                        margin: 0,
                        padding: "16px 0",
                        background: "#0d1117",
                        borderRadius: 0,
                        fontSize: "0.9rem",
                        lineHeight: 1.7,
                      }}
                    >
                      {value}
                    </SyntaxHighlighter>
                  </div>
                );
              },

              // Images
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg my-4 max-w-full border border-white/10"
                />
              ),

              // Tables
              table: ({ children }) => (
                <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                  <table className="w-full border-collapse">{children}</table>
                </div>
              ),

              thead: ({ children }) => (
                <thead className="bg-zinc-800">{children}</thead>
              ),

              tbody: ({ children }) => (
                <tbody className="divide-y divide-white/10">{children}</tbody>
              ),

              tr: ({ children }) => (
                <tr className="hover:bg-white/5 transition-colors">
                  {children}
                </tr>
              ),

              th: ({ children }) => (
                <th className="border border-white/10 px-4 py-3 text-left font-semibold">
                  {children}
                </th>
              ),

              td: ({ children }) => (
                <td className="border border-white/10 px-4 py-3">{children}</td>
              ),

              // Keyboard Keys
              kbd: ({ children }) => (
                <kbd className="px-2 py-1 rounded bg-zinc-700 border border-zinc-600 text-sm font-mono">
                  {children}
                </kbd>
              ),

              // Mark
              mark: ({ children }) => (
                <mark className="bg-yellow-400 text-black px-1 rounded">
                  {children}
                </mark>
              ),

              // Small
              small: ({ children }) => (
                <small className="text-sm text-gray-400">{children}</small>
              ),

              // Subscript
              sub: ({ children }) => (
                <sub className="text-xs align-sub">{children}</sub>
              ),

              // Superscript
              sup: ({ children }) => (
                <sup className="text-xs align-super">{children}</sup>
              ),
            }}
          >
            {content}
          </Markdown>
        ) : null}
      </div>

      {previewImage ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[92vw]">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg"
            ></button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[92vw] rounded-2xl border border-white/10 object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MessageBubble;
