"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2 } from "lucide-react";

const qualities = [
  { id: "web", label: "Web", desc: "60%", quality: 0.6 },
  { id: "print", label: "Print", desc: "75%", quality: 0.75 },
  { id: "hq", label: "High", desc: "90%", quality: 0.9 },
];

export default function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState("web");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type.startsWith("image/")) {
      setFile(f);
      setResultUrl(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    }
  }, []);

  const compressImage = async () => {
    if (!file || !preview) return;
    setIsProcessing(true);
    
    try {
      const q = qualities.find((q) => q.id === quality)?.quality || 0.6;
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob!);
            setResultUrl(url);
            setResultSize(blob!.size);
          },
          "image/jpeg",
          q
        );
      };
      img.src = preview;
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
    a.download = file.name.replace(/\.[^.]+$/, "_compressed.jpg");
    a.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Compress Image</h1>
        <p className="text-gray-500 mb-8">Reduce file size by lowering quality</p>

        {!resultUrl ? (
          <div className="space-y-6">
            <div
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files?.[0])} className="hidden" />
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl mb-4" />
              ) : (
                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              )}
              <p className="font-medium text-gray-900">{file ? file.name : "Drop image here"}</p>
              {file && <p className="text-sm text-gray-500 mt-1">{formatSize(file.size)}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Quality</label>
              <div className="grid grid-cols-3 gap-2">
                {qualities.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q.id)}
                    className={`p-3 rounded-xl text-center transition-colors ${quality === q.id ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    <p className="font-medium">{q.label}</p>
                    <p className={`text-xs ${quality === q.id ? "text-gray-300" : "text-gray-400"}`}>{q.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={compressImage} disabled={!file || isProcessing} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isProcessing ? "Compressing..." : "Compress Image"}
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">{Math.round((1 - resultSize / (file?.size || 1)) * 100)}%</p>
            <p className="text-gray-500 mb-6">Size reduced</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
              <span>{formatSize(file?.size || 0)}</span>
              <span>→</span>
              <span className="font-medium text-gray-900">{formatSize(resultSize)}</span>
            </div>
            <button onClick={download} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Download
            </button>
            <button onClick={() => { setResultUrl(null); setFile(null); setPreview(null); }} className="w-full py-3 mt-3 text-gray-500 hover:text-gray-700">Compress another</button>
          </div>
        )}
      </div>
    </div>
  );
}
