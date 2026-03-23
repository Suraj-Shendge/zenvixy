"use client";

import { useState, useRef, useCallback } from "react";
import { Download, Upload, Loader2, Maximize2 } from "lucide-react";

const presets = [
  { label: "HD", width: 1920, height: 1080 },
  { label: "4K", width: 3840, height: 2160 },
  { label: "Instagram", width: 1080, height: 1080 },
  { label: "Twitter", width: 1200, height: 675 },
];

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setResultUrl(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        const img = new window.Image();
        img.onload = () => {
          setOriginalDimensions({ w: img.width, h: img.height });
          setWidth(img.width);
          setHeight(img.height);
        };
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const resizeImage = useCallback(() => {
    if (!file || !preview) return;
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
        if (blob) setResultUrl(URL.createObjectURL(blob));
        setIsProcessing(false);
      }, "image/jpeg", 0.92);
    };
    img.src = preview;
  }, [file, preview, width, height]);

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, "_resized.jpg") || "image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResultUrl(null);
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspect && originalDimensions.w > 0) {
      const ratio = originalDimensions.h / originalDimensions.w;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspect && originalDimensions.h > 0) {
      const ratio = originalDimensions.w / originalDimensions.h;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-sm text-gray-500 hover:text-black">Back</a>
            <h1 className="text-base font-semibold text-black">Resize Image</h1>
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
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium text-black mb-1">Drop image here</p>
                <p className="text-sm text-gray-400">or click to browse</p>
              </div>
            )}

            {file && preview && (
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden bg-gray-100">
                  <img src={preview} alt="Preview" className="w-full h-auto max-h-64 object-contain" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-black">{file.name}</p>
                  <p className="text-sm text-gray-500">Original: {originalDimensions.w} x {originalDimensions.h}</p>
                </div>
              </div>
            )}

            {file && (
              <>
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Presets</p>
                  <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => (
                      <button key={preset.label} onClick={() => applyPreset(preset)} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                      <input type="number" value={width} onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none" />
                    </div>
                    <span className="text-gray-400 mt-7">x</span>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                      <input type="number" value={height} onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="rounded" />
                    Maintain aspect ratio
                  </label>
                </div>

                <button onClick={resizeImage} className="w-full mt-6 py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
                  <Maximize2 className="w-5 h-5" />
                  Resize Image
                </button>
              </>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden bg-gray-100">
              <img src={resultUrl} alt="Result" className="w-full h-auto" />
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="font-medium text-black">{width} x {height}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 py-4 bg-gray-100 text-black rounded-xl font-medium">Resize Another</button>
              <button onClick={downloadResult} className="flex-1 py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />Download
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
