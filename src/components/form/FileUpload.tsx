import React, { useState, ChangeEvent, DragEvent } from "react";

interface FileUploadProps {
  files: File[];
  onFileChange: (files: File[]) => void;
  multiple?: boolean;
}

const FileUpload = ({ files, onFileChange, multiple = true }: FileUploadProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    onFileChange([...files, ...newFiles]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    onFileChange([...files, ...newFiles]);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeFile = (index: number) => {
    onFileChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        className="border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-[120px] bg-white"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer text-gray-400 w-full h-full flex justify-center items-center"
        >
          Klikk her eller dra filer hit for å laste opp
        </label>
      </div>
      <div>
        <ul className="mt-4 w-full">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 border-b border-gray-200"
            >
              <span className="text-white">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                Fjern
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
