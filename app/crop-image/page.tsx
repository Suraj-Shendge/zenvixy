"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Crop, Download, X, Upload, Loader2, Move, ZoomIn } from "lucide-react";

type AspectRatio = "free" | "1:1" | "4:3" | "16:9" | "3:2" | "9:16" | "4:5";

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  // Crop state
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("free");
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatios: { value: AspectRatio; label: string }[] = [
    { value: "free", label: "Free" },
    { value: "1:1", label: "Square" },
    { value: "4:3", label: "4:3" },
    { value: "16:9", label: "Landscape" },
    { value: "3:2", label: "3:2" },
    { value: "9:16", label: "Portrait" },
    { value: "4:5", label: "4:5" },
  ];

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  useEffect(() => {
    if (preview && imageRef.current) {
      imageRef.current.onload = () => {
        setCropArea({ x: 10, y: 10, width: 80, height: aspectRatio === "free" ? 80 : 80 });
      };
    }
  }, [preview, aspectRatio]);

  const getAspectRatioValue = (ratio: AspectRatio): number | null => {
    switch (ratio) {
      case "1:1": return 1;
      case "4:3": return 4/3;
      case "16:9": return 16/9;
      case "3:2": return 3/2;
      case "9:16": return 9/16;
      case "4:5": return 4/5;
      default: return null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setIsDragging(true);
    setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    let newX = x - dragStart.x;
    let newY = y - dragStart.y;
    
    // Constrain to image bounds
    newX = Math.max(0, Math.min(100 - cropArea.width, newX));
    newY = Math.max(0, Math.min(100 - cropArea.height, newY));
    
    setCropArea(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = async () => {
    if (!file || !preview) return;
    
    setIsProcessing(true);
    
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const container = containerRef.current;
        if (!container) return;
        
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Calculate actual crop coordinates
        const cropX = (cropArea.x / 100) * img.width;
        const cropY = (cropArea.y / 100) * img.height;
        const cropWidth = (cropArea.width / 100) * img.width;
        const cropHeight = (cropArea.height / 100) * img.height;
        
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setResult(url);
            }
            setIsProcessing(false);
          }, "image/jpeg", 0.92);
        } else {
          setIsProcessing(false);
        }
      };
      img.src = preview;
    } catch (error) {
      console.error("Crop failed:", error);
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = file?.name.replace(/\.[^.]+$/, "_cropped.jpg") || "cropped.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
              ← Back
            </a>
            <h1 className="text-base font-semibold text-black">Crop Image</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Upload Zone */}
        {!preview && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              dragOver ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-gray-400" />
            </div>
            <p className="font-medium text-black mb-1">Drop image here</p>
            <p className="text-sm text-gray-400">or click to browse</p>
          </div>
        )}

        {/* Crop Preview */}
        {preview && !result && (
          <div className="space-y-6">
            {/* Aspect Ratio Selector */}
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    aspectRatio === ratio.value
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>

            {/* Image with Crop Overlay */}
            <div
              ref={containerRef}
              className="relative rounded-2xl overflow-hidden cursor-crosshair bg-gray-100"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={preview}
                alt="Crop preview"
                className="w-full h-auto max-h-[500px] object-contain"
                draggable={false}
              />
              
              {/* Dark overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute bg-black/50"
                  style={{
                    left: 0,
                    top: 0,
                    width: `${cropArea.x}%`,
                    height: "100%"
                  }}
                />
                <div 
                  className="absolute bg-black/50"
                  style={{
                    left: `${cropArea.x + cropArea.width}%`,
                    top: 0,
                    width: `${100 - cropArea.x - cropArea.width}%`,
                    height: "100%"
                  }}
                />
                <div 
                  className="absolute bg-black/50"
                  style={{
                    left: `${cropArea.x}%`,
                    top: 0,
                    width: `${cropArea.width}%`,
                    height: `${cropArea.y}%`
                  }}
                />
                <div 
                  className="absolute bg-black/50"
                  style={{
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y + cropArea.height}%`,
                    width: `${cropArea.width}%`,
                    height: `${100 - cropArea.y - cropArea.height}%`
                  }}
                />
              </div>

              {/* Crop box */}
              <div
                className="absolute border-2 border-white cursor-move"
                style={{
                  left: `${cropArea.x}%`,
                  top: `${cropArea.y}%`,
                  width: `${cropArea.width}%`,
                  height: `${cropArea.height}%`,
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)"
                }}
              >
                {/* Corner handles */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-white/30" />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              <Move className="w-4 h-4 inline mr-1" />
              Drag to move crop area
            </p>

            {/* Crop Button */}
            <button
              onClick={handleCrop}
              disabled={isProcessing}
              className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
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

        {/* Result */}
        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden bg-gray-100">
              <img src={result} alt="Cropped result" className="w-full h-auto" />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => { setResult(null); setPreview(null); setFile(null); }}
                className="flex-1 py-4 bg-gray-100 text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Crop Another
              </button>
              <button
                onClick={downloadResult}
                className="flex-1 py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">
            All processing happens in your browser. Your files never leave your device.
          </p>
        </div>
      </main>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
