"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, Crop, X, RotateCw, ArrowLeft } from "lucide-react";

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, size: 200 });
  const [rotation, setRotation] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl("");
    setPreview(URL.createObjectURL(f));
    setRotation(0);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setResultUrl("");
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const applyCrop = () => {
    if (!preview) return;

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Apply rotation
      const angle = (rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(angle));
      const sin = Math.abs(Math.sin(angle));
      const rotatedWidth = img.width * cos + img.height * sin;
      const rotatedHeight = img.width * sin + img.height * cos;

      canvas.width = rotatedWidth;
      canvas.height = rotatedHeight;
      ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
      ctx.rotate(angle);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      // Calculate crop area relative to image
      const scaleX = img.width / (imageRef.current?.clientWidth || 1);
      const scaleY = img.height / (imageRef.current?.clientHeight || 1);
      
      const cropX = Math.round((cropArea.x / 100) * img.width);
      const cropY = Math.round((cropArea.y / 100) * img.height);
      const cropSize = Math.round((cropArea.size / 100) * Math.min(img.width, img.height));

      // Create cropped image
      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = cropSize;
      cropCanvas.height = cropSize;
      const cropCtx = cropCanvas.getContext("2d");
      if (!cropCtx) return;

      cropCtx.drawImage(
        canvas,
        cropX, cropY, cropSize, cropSize,
        0, 0, cropSize, cropSize
      );

      setResultUrl(cropCanvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = preview;
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, "_cropped.jpg") || "cropped.jpg";
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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Crop Image</h1>
        <p className="text-gray-500 mb-8">Select an area to crop from your image</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50/50 transition-all bg-white"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900 text-lg mb-2">Drop your image here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </label>
        ) : (
          <div className="space-y-6">
            {/* Image with Crop Overlay */}
            <div
              ref={containerRef}
              className="relative bg-white rounded-2xl p-4 overflow-hidden"
            >
              <div className="relative select-none">
                <img
                  ref={imageRef}
                  src={preview}
                  alt="Preview"
                  className="max-w-full mx-auto max-h-96 object-contain"
                  draggable={false}
                />
                
                {/* Crop Box Overlay */}
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-move"
                  style={{
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.size}%`,
                    height: `${cropArea.size}%`,
                  }}
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startCrop = { ...cropArea };

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const dx = moveEvent.clientX - startX;
                      const dy = moveEvent.clientY - startY;
                      const containerWidth = containerRef.current?.clientWidth || 1;
                      const containerHeight = containerRef.current?.clientHeight || 1;

                      setCropArea({
                        ...startCrop,
                        x: Math.max(0, Math.min(100 - startCrop.size, startCrop.x + (dx / containerWidth) * 100)),
                        y: Math.max(0, Math.min(100 - startCrop.size, startCrop.y + (dy / containerHeight) * 100)),
                      });
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener("mousemove", handleMouseMove);
                      document.removeEventListener("mouseup", handleMouseUp);
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                >
                  {/* Crop Handles */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-500 -translate-x-1/2" />
                  <div className="absolute top-0 left-0 w-3 h-3 bg-white border-2 border-blue-500 rounded-sm cursor-nw-resize" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-white border-2 border-blue-500 rounded-sm cursor-ne-resize" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-white border-2 border-blue-500 rounded-sm cursor-sw-resize" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-white border-2 border-blue-500 rounded-sm cursor-se-resize" />
                </div>
              </div>
            </div>

            {/* Crop Size Slider */}
            <div className="bg-white rounded-2xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Size: {Math.round(cropArea.size)}%
              </label>
              <input
                type="range"
                min="10"
                max="90"
                value={cropArea.size}
                onChange={(e) => setCropArea(prev => ({ ...prev, size: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Rotation Controls */}
            <div className="bg-white rounded-2xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation: {rotation}°
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRotation(prev => prev - 90)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="15"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm text-gray-500 w-12">{rotation}°</span>
              </div>
            </div>

            {/* Result */}
            {resultUrl && (
              <div className="bg-white rounded-2xl p-4">
                <p className="font-medium text-gray-900 mb-4">Result</p>
                <div className="rounded-xl overflow-hidden mb-4">
                  <img src={resultUrl} alt="Result" className="max-w-full mx-auto" />
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
                onClick={applyCrop}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700"
              >
                Apply Crop
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
