"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, Maximize2, Lock, Unlock, ArrowLeft } from "lucide-react";

const presets = [
  { name: "HD", width: 1920, height: 1080 },
  { name: "Full HD", width: 1920, height: 1080 },
  { name: "Square", width: 1080, height: 1080 },
  { name: "4K", width: 3840, height: 2160 },
  { name: "Instagram", width: 1080, height: 1080 },
  { name: "Twitter", width: 1600, height: 900 },
];

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [lockAspect, setLockAspect] = useState(true);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl("");

    const url = URL.createObjectURL(f);
    setPreview(url);

    const img = new window.Image();
    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height });
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreview(url);
      setFile(f);
      setResultUrl("");

      const img = new window.Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
    }
  }, []);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (lockAspect && originalSize.width) {
      const ratio = originalSize.height / originalSize.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (lockAspect && originalSize.height) {
      const ratio = originalSize.width / originalSize.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const applyResize = () => {
    if (!preview) return;

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
      }, "image/jpeg", 0.92);
    };
    img.src = preview;
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, `_${width}x${height}.jpg`) || `resized_${width}x${height}.jpg`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resize Image</h1>
        <p className="text-gray-500 mb-8">Change image dimensions while maintaining quality</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50/50 transition-all bg-white"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-100 flex items-center justify-center">
              <Maximize2 className="w-8 h-8 text-cyan-600" />
            </div>
            <p className="font-semibold text-gray-900 text-lg mb-2">Drop your image here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </label>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl p-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center min-h-64">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-72 object-contain"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                Original: {originalSize.width} × {originalSize.height}
              </p>
            </div>

            {/* Size Presets */}
            <div className="bg-white rounded-2xl p-4">
              <p className="font-medium text-gray-900 mb-3">Quick Presets</p>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setWidth(preset.width);
                      setHeight(preset.height);
                    }}
                    className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-gray-900">Custom Size</p>
                <button
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`flex items-center gap-1 text-sm ${lockAspect ? "text-cyan-600" : "text-gray-400"}`}
                >
                  {lockAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  {lockAspect ? "Locked" : "Unlocked"}
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Width</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <span className="text-gray-400 mt-5">×</span>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Height</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Result */}
            {resultUrl && (
              <div className="bg-white rounded-2xl p-4">
                <p className="font-medium text-gray-900 mb-4">Result: {width} × {height}</p>
                <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center mb-4">
                  <img src={resultUrl} alt="Result" className="max-w-full max-h-72 object-contain" />
                </div>
                <button
                  onClick={downloadResult}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
            )}

            {/* Actions */}
            {!resultUrl && (
              <button
                onClick={applyResize}
                className="w-full py-4 bg-cyan-600 text-white rounded-2xl font-semibold hover:bg-cyan-700"
              >
                Resize Image
              </button>
            )}

            <button
              onClick={() => { setFile(null); setPreview(""); setResultUrl(""); }}
              className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              Choose Different Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
