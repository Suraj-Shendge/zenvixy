"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, Image as ImageIcon, Loader2, CheckCircle2, X, Lock } from "lucide-react";

const PRESETS = [
  { label: "HD", width: 1920, height: 1080 },
  { label: "Full HD", width: 1920, height: 1080 },
  { label: "Square", width: 1080, height: 1080 },
  { label: "Instagram", width: 1080, height: 1350 },
  { label: "Twitter", width: 1600, height: 900 },
  { label: "YouTube Thumb", width: 1280, height: 720 },
];

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [targetSize, setTargetSize] = useState({ width: 1920, height: 1080 });
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      const img = new window.Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setTargetSize({ width: img.width, height: img.height });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const resizeImage = async () => {
    if (!file || !preview) return;
    setIsProcessing(true);

    try {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetSize.width;
        canvas.height = targetSize.height;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetSize.width, targetSize.height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setResult({ url: URL.createObjectURL(blob) });
            }
            setIsProcessing(false);
          },
          "image/jpeg",
          0.92
        );
      };
      img.src = preview;
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = file?.name.replace(/\.[^.]+$/, `_${targetSize.width}x${targetSize.height}.jpg`) || "resized.jpg";
    a.click();
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTargetSize({ width: preset.width, height: preset.height });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              Resize Image
            </h1>
            <p className="text-gray-500 mt-1">Change image dimensions</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-gray-700 mb-1">Drop an image or click to upload</p>
            <p className="text-sm text-gray-500">JPG, PNG, WebP supported</p>
          </div>
        ) : result ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Resized!</h2>
            <p className="text-gray-500 mb-6">{targetSize.width} × {targetSize.height} pixels</p>
            <button
              onClick={downloadResult}
              className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mx-auto"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={() => {
                URL.revokeObjectURL(result.url);
                setResult(null);
              }}
              className="mt-4 text-gray-500 hover:text-gray-700"
            >
              Resize another
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={preview!} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{originalSize.width} × {originalSize.height}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-medium text-gray-900 mb-3">Quick Presets</h3>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      targetSize.width === preset.width && targetSize.height === preset.height
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Custom Size</h3>
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="rounded"
                  />
                  <Lock className="w-3 h-3" />
                  Lock aspect ratio
                </label>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Width</label>
                  <input
                    type="number"
                    value={targetSize.width}
                    onChange={(e) => {
                      const w = parseInt(e.target.value) || 1;
                      setTargetSize((prev) => ({
                        width: w,
                        height: maintainAspect ? Math.round(w * (originalSize.height / originalSize.width)) : prev.height,
                      }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                  />
                </div>
                <span className="text-gray-400 mt-5">×</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Height</label>
                  <input
                    type="number"
                    value={targetSize.height}
                    onChange={(e) => {
                      const h = parseInt(e.target.value) || 1;
                      setTargetSize((prev) => ({
                        height: h,
                        width: maintainAspect ? Math.round(h * (originalSize.width / originalSize.height)) : prev.width,
                      }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={resizeImage}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resizing...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Resize Image
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
