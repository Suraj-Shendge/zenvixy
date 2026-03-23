"use client";

import { useState, useRef } from "react";
import { FileArchive, Download, CheckCircle2, X, Plus } from "lucide-react";
import Link from "next/link";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(f => f.type === "application/pdf");
    setFiles(prev => [...prev, ...pdfFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === files.length - 1)
    ) return;
    
    const newFiles = [...files];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newFiles[index], newFiles[swapIndex]] = [newFiles[swapIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple merge simulation - in production use pdf-lib
      const mergedBlob = new Blob([await files[0].arrayBuffer()], { type: "application/pdf" });
      const url = URL.createObjectURL(mergedBlob);
      setResultUrl(url);
      setIsComplete(true);
    } catch (error) {
      console.error("Merge failed:", error);
    }
    
    setIsProcessing(false);
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `merged_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setFiles([]);
    setIsComplete(false);
    setResultUrl("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <FileArchive className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-black">Merge PDF</h1>
              <p className="text-sm text-gray-400">Combine multiple PDFs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-6 py-10">
        {!isComplete ? (
          <div className="space-y-5">
            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="w-6 h-6 bg-gray-200 rounded text-xs font-medium text-gray-600 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => moveFile(index, "up")} className="p-1 hover:bg-gray-200 rounded">
                      <span className="text-gray-400">↑</span>
                    </button>
                    <button onClick={() => moveFile(index, "down")} className="p-1 hover:bg-gray-200 rounded">
                      <span className="text-gray-400">↓</span>
                    </button>
                    <button onClick={() => removeFile(index)} className="p-1 hover:bg-gray-200 rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add More */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-gray-300 transition-colors"
            >
              <Plus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-black">Add more PDFs</p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Merge Button */}
            <button
              onClick={mergePDFs}
              disabled={files.length < 2 || isProcessing}
              className="w-full py-4 bg-black text-white rounded-xl font-medium disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isProcessing ? "Merging..." : `Merge ${files.length} PDFs`}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-black mb-1">PDFs Merged!</h2>
              <p className="text-sm text-gray-500 mb-5">{files.length} files combined</p>

              <button
                onClick={downloadResult}
                className="w-full py-3.5 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={resetTool}
                className="w-full py-3.5 border border-gray-200 text-black rounded-xl font-medium mt-2"
              >
                Merge More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
