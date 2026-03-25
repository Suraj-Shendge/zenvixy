"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2 } from "lucide-react";

const ratios = [
  { label: "Free", value: 0 },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
  { label: "3:2", value: 3 / 2 },
];

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ratio, setRatio] = useState(0);
  const [cropData, setCropData] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type.startsWith("image/")) {
      setFile(f);
      setResultUrl(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        const img = new window.Image();
        img.onload = () => {
          setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
          setCropData({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(f);
    }
  }, []);

  const cropImage = () => {
    if (!preview) return;
    setIsProcessing(true);
    const img = new window.Image();
    img.onload = () => {
      let w = cropData.w;
      let h = cropData.h;
      
      if (ratio > 0) {
        h = w / ratio;
      }
      
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, cropData.x, cropData.y, w, h, 0, 0, w, h);
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
    a.download = file.name.replace(/\.[^.]+$/, "_cropped.jpg");
    a.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Crop Image</h1>
        <p className="text-gray-500 mb-8">Crop image with aspect ratio presets</p>

        {!resultUrl ? (
          <div className="space-y-6">
            <div onDrop={(e) => { e.preventDefault(); setIsDragging(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files?.[0])} className="hidden" />
              {preview ? <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl mb-4" /> : <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />}
              <p className="font-medium text-gray-900">{file ? file.name : "Drop image here"}</p>
              {imgSize.w > 0 && <p className="text-sm text-gray-500 mt-1">{imgSize.w} × {imgSize.h}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {ratios.map((r) => (
                  <button key={r.label} onClick={() => setRatio(r.value)} className={`p-3 rounded-xl text-center transition-colors ${ratio === r.value ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                    <p className="font-medium">{r.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {ratio === 0 && preview && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">X</label>
                  <input type="number" value={cropData.x} onChange={(e) => setCropData({ ...cropData, x: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Y</label>
                  <input type="number" value={cropData.y} onChange={(e) => setCropData({ ...cropData, y: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Width</label>
                  <input type="number" value={cropData.w} onChange={(e) => setCropData({ ...cropData, w: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Height</label>
                  <input type="number" value={cropData.h} onChange={(e) => setCropData({ ...cropData, h: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                </div>
              </div>
            )}

            <button onClick={cropImage} disabled={!file || isProcessing} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isProcessing ? "Cropping..." : "Crop Image"}
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-lg font-medium text-gray-900 mb-6">Crop complete!</p>
            <button onClick={download} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>
            <button onClick={() => { setResultUrl(null); setFile(null); setPreview(null); }} className="w-full py-3 mt-3 text-gray-500 hover:text-gray-700">Crop another</button>
          </div>
        )}
      </div>
    </div>
  );
}
