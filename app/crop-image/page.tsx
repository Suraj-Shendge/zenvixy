"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [croppedUrl, setCroppedUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Crop state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState({ width: 200, height: 200 });
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setCroppedUrl("");
    
    const img = new window.Image();
    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height });
      const size = Math.min(img.width, img.height);
      setCropSize({ width: size * 0.8, height: size * 0.8 });
      setCrop({ x: (img.width - size * 0.8) / 2, y: (img.height - size * 0.8) / 2 });
    };
    img.src = url;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
      setCroppedUrl("");
    }
  };

  const applyCrop = () => {
    if (!file || !imageRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = cropSize.width;
    canvas.height = cropSize.height;
    ctx.drawImage(img, crop.x, crop.y, cropSize.width, cropSize.height, 0, 0, cropSize.width, cropSize.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCroppedUrl(url);
      }
      setIsProcessing(false);
    }, "image/png");
  };

  const downloadResult = () => {
    if (!croppedUrl) return;
    const a = document.createElement("a");
    a.href = croppedUrl;
    a.download = file?.name.replace(/\.[^.]+$/, "_cropped.png") || "cropped.png";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Crop Image</h1>
        <p className="text-gray-500 mb-6">Crop your image with precise control</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-amber-500 transition-colors bg-white"
          >
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <div className="text-4xl mb-4">📷</div>
            <p className="font-medium text-gray-900">Drop your image here</p>
            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
          </label>
        ) : (
          <div className="space-y-6">
            {/* Preview with Crop Overlay */}
            <div className="bg-white rounded-2xl p-4 relative overflow-hidden">
              <div className="relative max-w-full mx-auto" style={{ maxHeight: "500px" }}>
                <img
                  ref={imageRef}
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-[500px] mx-auto block"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img && !originalSize.width) {
                      setOriginalSize({ width: img.naturalWidth, height: img.naturalHeight });
                    }
                  }}
                  crossOrigin="anonymous"
                />
                {/* Crop Box Overlay */}
                <div
                  className="absolute border-2 border-amber-500 bg-transparent cursor-move"
                  style={{
                    left: crop.x,
                    top: crop.y,
                    width: cropSize.width,
                    height: cropSize.height,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const startX = e.clientX - crop.x;
                    const startY = e.clientY - crop.y;
                    
                    const onMouseMove = (e: MouseEvent) => {
                      setCrop({
                        x: Math.max(0, Math.min(e.clientX - startX, originalSize.width - cropSize.width)),
                        y: Math.max(0, Math.min(e.clientY - startY, originalSize.height - cropSize.height)),
                      });
                    };
                    
                    const onMouseUp = () => {
                      document.removeEventListener("mousemove", onMouseMove);
                      document.removeEventListener("mouseup", onMouseUp);
                    };
                    
                    document.addEventListener("mousemove", onMouseMove);
                    document.addEventListener("mouseup", onMouseUp);
                  }}
                >
                  {/* Resize handles */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-sm cursor-se-resize"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const startW = cropSize.width;
                      const startH = cropSize.height;
                      
                      const onMouseMove = (e: MouseEvent) => {
                        const newW = Math.max(50, Math.min(startW + e.clientX - startX, originalSize.width - crop.x));
                        const newH = aspectRatio ? newW / aspectRatio : Math.max(50, Math.min(startH + e.clientY - startY, originalSize.height - crop.y));
                        setCropSize({ width: newW, height: newH });
                      };
                      
                      const onMouseUp = () => {
                        document.removeEventListener("mousemove", onMouseMove);
                        document.removeEventListener("mouseup", onMouseUp);
                      };
                      
                      document.addEventListener("mousemove", onMouseMove);
                      document.addEventListener("mouseup", onMouseUp);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Crop Controls */}
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Width</label>
                  <input
                    type="number"
                    value={Math.round(cropSize.width)}
                    onChange={(e) => setCropSize({ ...cropSize, width: Number(e.target.value) })}
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Height</label>
                  <input
                    type="number"
                    value={Math.round(cropSize.height)}
                    onChange={(e) => setCropSize({ ...cropSize, height: Number(e.target.value) })}
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Presets:</span>
                {[
                  { label: "1:1", ratio: 1 },
                  { label: "4:3", ratio: 4/3 },
                  { label: "16:9", ratio: 16/9 },
                  { label: "Free", ratio: undefined },
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => {
                      if (r.ratio) {
                        setCropSize({ width: cropSize.width, height: cropSize.width / r.ratio });
                        setAspectRatio(r.ratio);
                      } else {
                        setAspectRatio(undefined);
                      }
                    }}
                    className={`px-3 py-1 text-sm rounded-lg ${aspectRatio === r.ratio ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <button
                onClick={applyCrop}
                disabled={isProcessing}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {isProcessing ? "Cropping..." : "Apply Crop"}
              </button>

              <button
                onClick={() => { setFile(null); setPreview(""); setCroppedUrl(""); }}
                className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                Choose Different Image
              </button>
            </div>

            {/* Result Preview */}
            {croppedUrl && (
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Result Preview</h3>
                <img src={croppedUrl} alt="Cropped" className="max-w-full mx-auto rounded-xl mb-4" />
                <button
                  onClick={downloadResult}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  Download Cropped Image
                </button>
              </div>
            )}
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
