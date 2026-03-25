"use client";

import { useState, useRef } from "react";

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [newWidth, setNewWidth] = useState(1920);
  const [newHeight, setNewHeight] = useState(1080);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      setNewWidth(img.width);
      setNewHeight(img.height);
    };
    img.src = url;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setResultUrl("");
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  };

  const handleWidthChange = (w: number) => {
    setNewWidth(w);
    if (maintainAspect && originalSize.height) {
      setNewHeight(Math.round(w * (originalSize.height / originalSize.width)));
    }
  };

  const handleHeightChange = (h: number) => {
    setNewHeight(h);
    if (maintainAspect && originalSize.width) {
      setNewWidth(Math.round(h * (originalSize.width / originalSize.height)));
    }
  };

  const resizeImage = () => {
    if (!preview) return;
    setIsProcessing(true);
    
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/png");
    };
    img.src = preview;
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, `_${newWidth}x${newHeight}.png`) || "resized.png";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resize Image</h1>
        <p className="text-gray-500 mb-6">Change image dimensions while maintaining quality</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 transition-colors bg-white"
          >
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <div className="text-4xl mb-4">🖼️</div>
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
                Original: {originalSize.width} × {originalSize.height}
              </p>
            </div>

            {/* Dimensions */}
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600">Maintain aspect ratio</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Width (px)</label>
                  <input
                    type="number"
                    value={newWidth}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Height (px)</label>
                  <input
                    type="number"
                    value={newHeight}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Presets:</span>
                {[1920, 1280, 800, 640].map((w) => (
                  <button
                    key={w}
                    onClick={() => handleWidthChange(w)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    {w}px
                  </button>
                ))}
              </div>

              <button
                onClick={resizeImage}
                disabled={isProcessing}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? "Resizing..." : "Resize Image"}
              </button>
            </div>

            {/* Result Preview */}
            {resultUrl && (
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Result Preview</h3>
                <div className="relative max-h-[400px] overflow-hidden rounded-xl bg-gray-100 mb-4">
                  <img src={resultUrl} alt="Result" className="max-w-full mx-auto" />
                </div>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  New size: {newWidth} × {newHeight}
                </p>
                <button
                  onClick={downloadResult}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  Download Resized Image
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
