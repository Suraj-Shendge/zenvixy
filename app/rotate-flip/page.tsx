"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2, RotateCw, FlipHorizontal, FlipVertical } from "lucide-react";

export default function RotateFlip() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
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

  const processImage = () => {
    if (!preview) return;
    setIsProcessing(true);
    const img = new window.Image();
    img.onload = () => {
      const rad = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      const w = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
      const h = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.translate(w / 2, h / 2);
      ctx.rotate(rad);
      if (flipH) ctx.scale(-1, 1);
      if (flipV) ctx.scale(1, -1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
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
    a.download = file.name.replace(/\.[^.]+$/, "_processed.jpg");
    a.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Rotate & Flip</h1>
        <p className="text-gray-500 mb-8">Rotate or flip your image</p>

        {!resultUrl ? (
          <div className="space-y-6">
            <div onDrop={(e) => { e.preventDefault(); setIsDragging(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files?.[0])} className="hidden" />
              {preview ? <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl mb-4" /> : <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />}
              <p className="font-medium text-gray-900">{file ? file.name : "Drop image here"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Rotation</label>
              <div className="flex gap-2">
                {[0, 90, 180, 270].map((deg) => (
                  <button key={deg} onClick={() => setRotation(deg)} className={`flex-1 p-3 rounded-xl text-center transition-colors ${rotation === deg ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                    <RotateCw className="w-5 h-5 mx-auto mb-1" style={{ transform: `rotate(${deg}deg)` }} />
                    <p className="text-sm font-medium">{deg}°</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Flip</label>
              <div className="flex gap-2">
                <button onClick={() => setFlipH(!flipH)} className={`flex-1 p-4 rounded-xl text-center transition-colors ${flipH ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  <FlipHorizontal className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Horizontal</p>
                </button>
                <button onClick={() => setFlipV(!flipV)} className={`flex-1 p-4 rounded-xl text-center transition-colors ${flipV ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  <FlipVertical className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Vertical</p>
                </button>
              </div>
            </div>

            <button onClick={processImage} disabled={!file || isProcessing} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isProcessing ? "Processing..." : "Apply"}
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-lg font-medium text-gray-900 mb-6">Done!</p>
            <button onClick={download} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>
            <button onClick={() => { setResultUrl(null); setFile(null); setPreview(null); setRotation(0); setFlipH(false); setFlipV(false); }} className="w-full py-3 mt-3 text-gray-500 hover:text-gray-700">Process another</button>
          </div>
        )}
      </div>
    </div>
  );
}
