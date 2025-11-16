import React, { useState } from "react";

interface AttachmentViewerProps {
  type: "image" | "pdf";
  src: string;
  alt?: string;
}

const AttachmentViewer = ({ type, src, alt }: AttachmentViewerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      {/* Thumbnail / preview */}
      {type === "image" ? (
        <div className="flex flex-col items-center">
          <img
            src={src}
            alt={alt}
            className="max-w-[400px] max-h-[300px] rounded-lg shadow-md mb-2"
          />
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-[#5dbc94] rounded text-white hover:bg-green-800"
          >
            Vis i fullskjerm
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Small inline PDF preview */}
          <iframe
            src={src}
            className="w-full h-[300px] rounded-lg border border-white/20 mb-2"
          />
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-[#53a784] rounded text-white hover:bg-green-800"
          >
            Vis i fullskjerm
          </button>
        </div>
      )}

      {/* Modal / full view */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          {type === "image" ? (
            <img
              src={src}
              alt={alt}
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
            />
          ) : (
            <iframe
              src={src}
              className="w-full max-w-[90vw] h-[90vh] rounded-lg shadow-lg"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AttachmentViewer;
