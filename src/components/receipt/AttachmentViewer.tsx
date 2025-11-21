import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface AttachmentViewerProps {
  type: "image" | "pdf";
  src: string;
  alt?: string;
  filename?: string; // optional, for PDF fallback download
}

const AttachmentViewer = ({ type, src, alt, filename }: AttachmentViewerProps) => {
  const [open, setOpen] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePdfError = () => setPdfError(true);
  const handleImageError = () => setImageError(true);

  useEffect(() => {
    if (type === "pdf") {
      fetch(src)
        .then((res) => {
          if (!res.ok) setPdfError(true);
        })
        .catch(() => setPdfError(true));
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="mb-6">
      {/* Thumbnail / preview */}
      {type === "image" ? (
        <div className="flex flex-col items-center">
          {!imageError ? (
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[300px] shadow-md mb-2"
              onError={handleImageError}
            />
          ) : (
            <div className="p-4 rounded text-white mb-2 flex flex-col items-center">
              <p>Bilde kunne ikke lastes</p>
              {filename && (
                <a
                  href={src}
                  download={filename}
                  className="mt-2 px-4 py-2 bg-[#5dbc94] rounded hover:bg-green-800"
                >
                  Last ned bilde
                </a>
              )}
            </div>
          )}
          <button
            onClick={() => setOpen(true)}
            className={`px-4 py-2 rounded text-white hover:bg-green-800 ${imageError ? "hidden" : "bg-[#53a784]"}`}
          >
            Vis i fullskjerm
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Small inline PDF preview */}
          {!pdfError ? (
            <iframe
              src={src}
              className="w-full h-[300px] rounded-lg border border-white/20 mb-2"
              onError={handlePdfError}
            />
          ) : (
            <div className="p-6 rounded text-white flex flex-col items-center">
              <p>PDF kunne ikke lastes</p>
              {filename && (
                <a
                  href={src}
                  download={filename}
                  className="mt-2 px-4 py-2 bg-[#53a784] rounded hover:bg-green-800"
                >
                  Last ned PDF
                </a>
              )}
            </div>
          )}
          <button
            onClick={() => setOpen(true)}
            className={`px-4 py-2 rounded text-white hover:bg-green-800 ${pdfError ? "hidden" : "bg-[#53a784]"}`}
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
          <div
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="mb-2 text-white p-2 hover:text-gray-300 self-end"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="overflow-auto shadow-lg flex justify-center p-2 max-w-[90vw] max-h-[90vh]">
              {type === "image" ? (
                imageError ? (
                  <div className="bg-[#437c64] p-6 rounded text-white flex flex-col items-center">
                    <p>Bilde kunne ikke lastes</p>
                    {filename && (
                      <a
                        href={src}
                        download={filename}
                        className="mt-2 px-4 py-2 bg-[#53a784] rounded hover:bg-green-800"
                      >
                        Last ned bilde
                      </a>
                    )}
                  </div>
                ) : (
                  <img
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-[80vh] rounded-lg"
                    onError={handleImageError}
                  />
                )
              ) : pdfError ? (
                <div className="bg-[#437c64] p-6 rounded text-white flex flex-col items-center">
                  <p>PDF kunne ikke lastes</p>
                  {filename && (
                    <a
                      href={src}
                      download={filename}
                      className="mt-2 px-4 py-2 bg-[#53a784] rounded hover:bg-green-800"
                    >
                      Last ned PDF
                    </a>
                  )}
                </div>
              ) : (
                <iframe
                  src={src}
                  className="w-[90vw] max-w-[80vw] h-[80vh] bg-white rounded-lg overflow-auto shadow-lg"
                  onError={handlePdfError}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AttachmentViewer;
