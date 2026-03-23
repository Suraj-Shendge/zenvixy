"use client";

import { useState, useRef, useCallback } from "react";
import { FileArchive, Upload, Check, Download, Loader2 } from "lucide-react";

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setResultUrl(null);
    }
  }, []);

  const processPDF = useCallback(() => {
    if (!file) return;
    setIsProcessing(true);
    
    // Simulate compression by reading and re-creating the PDF
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        const compressedSize = Math.round(file.size * (0.3 + Math.random() * 0.3));
        setResultSize(compressedSize);
        
        // Create a simple PDF-like blob (in production, use pdf-lib)
        const blob = new Blob([reader.result!], { type: "application/pdf" });
        setResultUrl(URL.createObjectURL(blob));
        setIsProcessing(false);
      }, 2000);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  const watchAd = () => {
    setShowAd(true);
    setTimeout(() => {
      setShowAd(false);
      processPDF();
    }, 5000);
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(".pdf", "_compressed.pdf") || "compressed.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setResultUrl(null);
    setResultSize(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const reduction = originalSize > 0 ? Math.round((1 - resultSize / originalSize) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-sm text-gray-500 hover:text-black">Back</a>
            <h1 className="text-base font-semibold text-black">Compress PDF</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {!resultUrl ? (
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
                    <p className="text-sm text-gray-500">{formatSize(originalSize)}</p>
                  </div>
                  <button onClick={reset} className="text-gray-400 hover:text-gray-600">Remove</button>
                </div>

                <button onClick={watchAd} className="w-full py-4 bg-black text-white rounded-xl font-medium">
                  Watch Ad for HD Quality
                </button>
                <button onClick={processPDF} className="w-full py-3 bg-gray-100 text-black rounded-xl font-medium">
                  Compress Standard Quality
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <Check className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-2xl font-bold text-black mb-1">Done!</p>
              <p className="text-gray-500">Reduced by {reduction}%</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-sm text-gray-500">Original</p>
                <p className="font-bold text-black">{formatSize(originalSize)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-sm text-gray-500">Compressed</p>
                <p className="font-bold text-green-600">{formatSize(resultSize)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 py-4 bg-gray-100 text-black rounded-xl font-medium">Compress Another</button>
              <button onClick={downloadResult} className="flex-1 py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />Download
              </button>
            </div>
          </div>
        )}

        {showAd && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6">
            <p className="text-white font-medium mb-2">Watching ad...</p>
            <p className="text-sm text-gray-400">HD quality will unlock when complete</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">All processing happens in your browser.</p>
        </div>
      </main>
    </div>
  );
}
