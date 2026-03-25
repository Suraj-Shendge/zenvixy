"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2 } from "lucide-react";

const blurLevels = [
  { label: "Light", value: 3 },
  { label: "Medium", value: 7 },
  { label: "Heavy", value: 15 },
];

export default function BlurImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [blur, setBlur] = useState(7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
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

  const applyBlur = () => {
    if (!preview) return;
    setIsProcessing(true);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(img, 0, 0);
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
    a.download = file.name.replace(/\.[^.]+$/, "_blurred.jpg");
    a.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Blur Image</h1>
        <p className="text-gray-500 mb-8">Apply blur effect to your image</p>

        {!resultUrl ? (
          <div className="space-y-6">
            <div onDrop={(e) => { e.preventDefault(); setIsDragging(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files?.[0])} className="hidden" />
              {preview ? <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl mb-4" /> : <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />}
              <p className="font-medium text-gray-900">{file ? file.name : "Drop image here"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Blur Level: {blur}</label>
              <input type="range" min="1" max="20" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full" />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {blurLevels.map((b) => (
                  <button key={b.value} onClick={() => setBlur(b.value)} className={`p-3 rounded-xl text-center transition-colors ${blur === b.value ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                    <p className="font-medium">{b.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={applyBlur} disabled={!file || isProcessing} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isProcessing ? "Processing..." : "Apply Blur"}
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-lg font-medium text-gray-900 mb-6">Blur applied!</p>
            <button onClick={download} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>
            <button onClick={() => { setResultUrl(null); setFile(null); setPreview(null); }} className="w-full py-3 mt-3 text-gray-500 hover:text-gray-700">Blur another</button>
          </div>
        )}
      </div>
    </div>
  );
}
