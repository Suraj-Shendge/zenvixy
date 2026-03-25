"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, Crop, Loader2, CheckCircle2, X } from "lucide-react";

const ASPECT_RATIOS = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
  { label: "3:2", value: 3 / 2 },
];

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
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
        setImageSize({ width: img.width, height: img.height });
        setCropArea({ x: 0, y: 0, width: 100, height: 100 });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    let newWidth = Math.abs(currentX - dragStart.x);
    let newHeight = Math.abs(currentY - dragStart.y);

    if (aspectRatio) {
      newHeight = newWidth / aspectRatio;
    }

    let newX = Math.min(dragStart.x, currentX);
    let newY = Math.min(dragStart.y, currentY);

    // Constrain to bounds
    if (newX + newWidth > 100) newWidth = 100 - newX;
    if (newY + newHeight > 100) newHeight = 100 - newY;

    setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const cropImage = async () => {
    if (!file || !preview) return;
    setIsProcessing(true);

    try {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const cropX = (cropArea.x / 100) * img.width;
        const cropY = (cropArea.y / 100) * img.height;
        const cropWidth = (cropArea.width / 100) * img.width;
        const cropHeight = (cropArea.height / 100) * img.height;

        canvas.width = cropWidth;
        canvas.height = cropHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setResult(URL.createObjectURL(blob));
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
    a.href = result;
    a.download = file?.name.replace(/\.[^.]+$/, "_cropped.jpg") || "cropped.jpg";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Crop className="w-5 h-5 text-white" />
              </div>
              Crop Image
            </h1>
            <p className="text-gray-500 mt-1">Select and crop your image</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cropped!</h2>
            <div className="mb-6 p-4 bg-checkerboard rounded-xl inline-block">
              <img src={result} alt="Result" className="max-h-64 rounded-lg" />
            </div>
            <button
              onClick={downloadResult}
              className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mx-auto"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={() => {
                URL.revokeObjectURL(result);
                setResult(null);
              }}
              className="mt-4 text-gray-500 hover:text-gray-700"
            >
              Crop another
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Aspect Ratio */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-medium text-gray-900 mb-3">Aspect Ratio</h3>
              <div className="grid grid-cols-6 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.label}
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      aspectRatio === ratio.value
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-medium text-gray-900 mb-3">Drag to select area</h3>
              <div
                ref={containerRef}
                className="relative w-full aspect-video bg-checkerboard rounded-xl overflow-hidden cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={preview!}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-contain"
                  draggable={false}
                />
                {/* Selection overlay */}
                <div
                  className="absolute border-2 border-indigo-600 bg-transparent"
                  style={{
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.width}%`,
                    height: `${cropArea.height}%`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                    {Math.round(cropArea.width)}% × {Math.round(cropArea.height)}%
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">Click and drag to select the area you want to keep</p>
            </div>

            <button
              onClick={cropImage}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Cropping...
                </>
              ) : (
                <>
                  <Crop className="w-5 h-5" />
                  Crop Image
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
