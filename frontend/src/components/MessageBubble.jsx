import React, { useState } from "react";
import Markdown from "react-markdown";

function MessageBubble({ role, content, images }) {
  const isUser = role == "user";
  const hasImages = !isUser && Array.isArray(images) && images.length > 0;
  const [previewImage, setPreviewImage] = useState(null);

  const markdownComponents = {
    img: () => null,
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2.5 rounded-2xl wrap-break-word overflow-hidden leading-relaxed ${
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
        {content ? <Markdown components={markdownComponents}>{content}</Markdown> : null}
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
            >
              ×
            </button>
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
