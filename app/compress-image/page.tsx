"use client";

import { useState, useRef } from "react";

export default function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [originalSize, setOriginalSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [resultSize, setResultSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOriginalSize(f.size);
    setResultUrl("");
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setOriginalSize(f.size);
      setResultUrl("");
      setPreview(URL.createObjectURL(f));
    }
  };

  const compressImage = () => {
    if (!preview) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
          setResultSize(blob.size);
        }
        setIsProcessing(false);
      }, "image/jpeg", quality / 100);
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
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Compress Image</h1>
        <p className="text-gray-500 mb-6">Reduce image file size</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 transition-colors bg-white"
          >
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <div className="text-4xl mb-4">🗜️</div>
            <p className="font-medium text-gray-900">Drop your image here</p>
            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
          </label>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl p-4">
              <div className="relative max-h-[400px] overflow-hidden rounded-xl bg-gray-100">
                <img src={preview} alt="Preview" className="max-w-full mx-auto" />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Original: {formatSize(originalSize)}
              </p>
            </div>

            {/* Quality Slider */}
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Quality</label>
                  <span className="text-sm text-gray-500">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              <button
                onClick={compressImage}
                disabled={isProcessing}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {isProcessing ? "Compressing..." : "Compress Image"}
              </button>
            </div>

            {/* Result */}
            {resultUrl && (
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Result</h3>
                <div className="relative max-h-[400px] overflow-hidden rounded-xl bg-gray-100 mb-4">
                  <img src={resultUrl} alt="Result" className="max-w-full mx-auto" />
                </div>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-gray-500">Original</span>
                  <span className="font-medium">{formatSize(originalSize)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-gray-500">Compressed</span>
                  <span className="font-medium text-green-600">{formatSize(resultSize)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-gray-500">Reduction</span>
                  <span className="font-medium text-green-600">
                    {Math.round((1 - resultSize / originalSize) * 100)}%
                  </span>
                </div>
                <button
                  onClick={downloadResult}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  Download
                </button>
              </div>
            )}

            <button
              onClick={() => { setFile(null); setPreview(""); setResultUrl(""); }}
              className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              Choose Different Image
            </button>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
