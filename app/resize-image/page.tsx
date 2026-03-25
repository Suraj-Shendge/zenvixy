"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2 } from "lucide-react";

const presets = [
  { label: "HD", width: 1920, height: 1080 },
  { label: "Square", width: 1080, height: 1080 },
  { label: "4K", width: 3840, height: 2160 },
  { label: "Mobile", width: 750, height: 1334 },
  { label: "Custom", width: 0, height: 0 },
];

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type.startsWith("image/")) {
      setFile(f);
      setResultUrl(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        const img = new window.Image();
        img.onload = () => { setWidth(img.naturalWidth); setHeight(img.naturalHeight); };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(f);
    }
  }, []);

  const resizeImage = () => {
    if (!preview) return;
    setIsProcessing(true);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        setResultUrl(URL.createObjectURL(blob!));
        setIsProcessing(false);
      }, "image/jpeg", 0.92);
    };
    img.src = preview;
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file.name.replace(/\.[^.]+$/, `_${width}x${height}.jpg`);
    a.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Resize Image</h1>
        <p className="text-gray-500 mb-8">Change dimensions while maintaining quality</p>

        {!resultUrl ? (
          <div className="space-y-6">
            <div onDrop={(e) => { e.preventDefault(); setIsDragging(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files?.[0])} className="hidden" />
              {preview ? <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl mb-4" /> : <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />}
              <p className="font-medium text-gray-900">{file ? file.name : "Drop image here"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Dimensions</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {presets.map((p) => (
                  <button key={p.label} onClick={() => { setWidth(p.width); setHeight(p.height); }} className={`p-3 rounded-xl text-center transition-colors ${width === p.width && height === p.height ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                    <p className="font-medium text-sm">{p.label}</p>
                    {p.width > 0 && <p className="text-xs text-gray-400">{p.width}×{p.height}</p>}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Width</label>
                  <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                </div>
                <span className="text-gray-400 mt-5">×</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Height</label>
                  <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                </div>
              </div>
            </div>

            <button onClick={resizeImage} disabled={!file || isProcessing} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isProcessing ? "Resizing..." : "Resize Image"}
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">{width} × {height}</p>
            <p className="text-gray-500 mb-6">New dimensions</p>
            <button onClick={download} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>
            <button onClick={() => { setResultUrl(null); setFile(null); setPreview(null); }} className="w-full py-3 mt-3 text-gray-500 hover:text-gray-700">Resize another</button>
          </div>
        )}
      </div>
    </div>
  );
}
