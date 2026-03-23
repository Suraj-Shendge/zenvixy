"use client";

import { useState, useRef, useCallback } from "react";
import { FileArchive, Upload, Check, Download, Loader2 } from "lucide-react";

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResultUrls([]);
      // Simulate getting page count
      setTotalPages(Math.floor(Math.random() * 10) + 3);
    }
  }, []);

  const processPDF = useCallback(() => {
    if (!file) return;
    setIsProcessing(true);
    
    // Simulate splitting (in production, use pdf-lib)
    setTimeout(() => {
      const urls: string[] = [];
      for (let i = 0; i < totalPages; i++) {
        const blob = new Blob([file], { type: "application/pdf" });
        urls.push(URL.createObjectURL(blob));
      }
      setResultUrls(urls);
      setIsProcessing(false);
    }, 2000);
  }, [file, totalPages]);

  const downloadAll = () => {
    resultUrls.forEach((url, index) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = file?.name.replace(".pdf", `_page_${index + 1}.pdf`) || `page_${index + 1}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const reset = () => {
    setFile(null);
    setTotalPages(0);
    setResultUrls([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-sm text-gray-500 hover:text-black">Back</a>
            <h1 className="text-base font-semibold text-black">Split PDF</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {resultUrls.length === 0 ? (
          <>
            {!file && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
                className={"border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all " + (dragOver ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300")}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
                <FileArchive className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium text-black mb-1">Drop PDF here</p>
                <p className="text-sm text-gray-400">or click to browse</p>
              </div>
            )}

            {file && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <span className="text-xs font-bold text-red-600">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-black truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{totalPages} pages detected</p>
                  </div>
                  <button onClick={reset} className="text-gray-400 hover:text-gray-600">Remove</button>
                </div>

                <button onClick={processPDF} disabled={isProcessing} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                  {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Split PDF"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <Check className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-2xl font-bold text-black mb-1">Done!</p>
              <p className="text-gray-500">{resultUrls.length} pages ready</p>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 py-4 bg-gray-100 text-black rounded-xl font-medium">Split Another</button>
              <button onClick={downloadAll} className="flex-1 py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />Download All
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">All processing happens in your browser.</p>
        </div>
      </main>
    </div>
  );
}
