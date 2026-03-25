"use client";

import { useState, useRef } from "react";
import { Upload, Download, Loader2, FileText, Check } from "lucide-react";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type === "application/pdf") {
      setFile(f);
      setOriginalSize(f.size);
      setResultUrl(null);
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const compressed = await pdfDoc.save({ useObjectStreams: true });
      const uint8 = new Uint8Array(compressed);
      const blob = new Blob([uint8], { type: "application/pdf" });
      
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch (err) {
      console.error(err);
    }
    setIsProcessing(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file.name.replace(".pdf", "_compressed.pdf");
    a.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Compress PDF</h1>
        <p className="text-gray-500 mb-8">Reduce PDF file size</p>

        {!resultUrl ? (
          <div className="space-y-6">
            <div
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
              {file ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatSize(file.size)}</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="font-medium text-gray-900">Drop PDF here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                </>
              )}
            </div>

            <button onClick={compressPdf} disabled={!file || isProcessing} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isProcessing ? "Compressing..." : "Compress PDF"}
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">{Math.round((1 - resultSize / originalSize) * 100)}%</p>
            <p className="text-gray-500 mb-4">compressed</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
              <span>{formatSize(originalSize)}</span>
              <span>→</span>
              <span className="font-medium text-gray-900">{formatSize(resultSize)}</span>
            </div>
            <button onClick={download} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Download
            </button>
            <button onClick={() => { setResultUrl(null); setFile(null); }} className="w-full py-3 mt-3 text-gray-500 hover:text-gray-700">Compress another</button>
          </div>
        )}
      </div>
    </div>
  );
}
