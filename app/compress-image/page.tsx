"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Minimize2, ArrowLeft, CheckCircle } from "lucide-react";

const qualityLevels = [
  { id: "low", label: "Low", desc: "60% quality", value: 0.6 },
  { id: "medium", label: "Medium", desc: "75% quality", value: 0.75 },
  { id: "high", label: "High", desc: "85% quality", value: 0.85 },
  { id: "max", label: "Maximum", desc: "95% quality", value: 0.95 },
];

export default function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [quality, setQuality] = useState(0.75);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOriginalSize(f.size);
    setResultUrl("");
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setOriginalSize(f.size);
      setResultUrl("");
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const compressImage = () => {
    if (!preview) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setCompressedSize(blob.size);
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/jpeg", quality);
    };
    img.src = preview;
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, "_compressed.jpg") || "compressed.jpg";
    a.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  const reduction = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Compress Image</h1>
        <p className="text-gray-500 mb-8">Reduce image file size while maintaining quality</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all bg-white"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Minimize2 className="w-8 h-8 text-purple-600" />
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
                {file.name} • {formatSize(originalSize)}
              </p>
            </div>

            {/* Quality Selection */}
            <div className="bg-white rounded-2xl p-4">
              <p className="font-medium text-gray-900 mb-3">Compression Level</p>
              <div className="grid grid-cols-4 gap-2">
                {qualityLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setQuality(level.value)}
                    className={`py-3 px-2 rounded-xl text-center transition-all ${
                      quality === level.value
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <p className="font-medium text-sm">{level.label}</p>
                    <p className={`text-xs ${quality === level.value ? "text-purple-200" : "text-gray-400"}`}>
                      {level.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            {resultUrl && (
              <div className="bg-white rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Compression Complete!</span>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Original</p>
                    <p className="font-semibold text-gray-900">{formatSize(originalSize)}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <p className="text-xs text-green-600">Compressed</p>
                    <p className="font-semibold text-green-700">{formatSize(compressedSize)}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <p className="text-xs text-purple-600">Reduced</p>
                    <p className="font-semibold text-purple-700">{reduction}%</p>
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center mb-4">
                  <img src={resultUrl} alt="Result" className="max-w-full max-h-72 object-contain" />
                </div>

                <button
                  onClick={downloadResult}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download ({formatSize(compressedSize)})
                </button>
              </div>
            )}

            {/* Compress Button */}
            {!resultUrl && (
              <button
                onClick={compressImage}
                disabled={isProcessing}
                className="w-full py-4 bg-purple-600 text-white rounded-2xl font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                {isProcessing ? "Compressing..." : "Compress Image"}
              </button>
            )}

            <button
              onClick={() => { setFile(null); setPreview(""); setResultUrl(""); setOriginalSize(0); setCompressedSize(0); }}
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
