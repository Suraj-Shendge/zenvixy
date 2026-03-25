"use client";

import { useState, useRef } from "react";
import { FileArchive, Download, Plus, Trash2, Loader2, CheckCircle2 } from "lucide-react";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList) => {
    const pdfs = Array.from(newFiles).filter((f) => f.type === "application/pdf");
    setFiles((prev) => [...prev, ...pdfs]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (from: number, to: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      [newFiles[from], newFiles[to]] = [newFiles[to], newFiles[from]];
      return newFiles;
    });
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/pdf/merge", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Merge failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, name: "merged.pdf" });
    } catch (error) {
      console.error(error);
      alert("Failed to merge PDFs");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.name;
    a.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <FileArchive className="w-5 h-5 text-white" />
                </div>
                Merge PDF
              </h1>
              <p className="text-gray-500 mt-1">Combine multiple PDFs into one document</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {!result ? (
          <>
            {/* Upload Area */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all mb-8"
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="font-medium text-gray-700 mb-1">Drop PDF files here or click to browse</p>
              <p className="text-sm text-gray-500">Select multiple files to merge</p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-medium text-gray-700">{files.length} files selected</span>
                  <button onClick={() => setFiles([])} className="text-sm text-red-600 hover:text-red-700">
                    Clear all
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => setDragIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIndex !== null && dragIndex !== index) moveFile(dragIndex, index);
                        setDragIndex(null);
                      }}
                      onDragEnd={() => setDragIndex(null)}
                      className={`px-5 py-4 flex items-center gap-4 cursor-grab active:cursor-grabbing ${
                        dragIndex === index ? "bg-indigo-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">
                        PDF
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                      </div>
                      <span className="text-sm text-gray-400">#{index + 1}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Merge Button */}
            {files.length >= 2 && (
              <button
                onClick={mergePDFs}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Merging...
                  </>
                ) : (
                  <>
                    <FileArchive className="w-5 h-5" />
                    Merge {files.length} PDFs
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          /* Result */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PDFs Merged!</h2>
            <p className="text-gray-500 mb-6">Your merged PDF is ready to download</p>
            <button
              onClick={downloadResult}
              className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mx-auto"
            >
              <Download className="w-5 h-5" />
              Download Merged PDF
            </button>
            <button
              onClick={() => {
                URL.revokeObjectURL(result.url);
                setResult(null);
                setFiles([]);
              }}
              className="mt-4 text-gray-500 hover:text-gray-700"
            >
              Merge more files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
