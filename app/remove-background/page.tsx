"use client";

import { useState, useRef } from "react";
import { Wand2, Upload, Download, Check } from "lucide-react";

export default function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setError(null);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
        setResult(null);
        setDownloaded(false);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setError(null);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
        setResult(null);
        setDownloaded(false);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const removeBackground = () => {
    if (!preview) return;
    setIsProcessing(true);
    setError(null);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample corner colors for background detection
        const corners = [
          { x: 0, y: 0 },
          { x: canvas.width - 1, y: 0 },
          { x: 0, y: canvas.height - 1 },
          { x: canvas.width - 1, y: canvas.height - 1 },
          { x: Math.floor(canvas.width / 2), y: 0 },
          { x: 0, y: Math.floor(canvas.height / 2) },
          { x: canvas.width - 1, y: Math.floor(canvas.height / 2) },
          { x: Math.floor(canvas.width / 2), y: canvas.height - 1 },
        ];
        
        const cornerColors: number[][] = [];
        for (const corner of corners) {
          const idx = (corner.y * canvas.width + corner.x) * 4;
          cornerColors.push([data[idx], data[idx + 1], data[idx + 2], data[idx + 3]]);
        }
        
        // Find most common corner color (background)
        const colorCounts: { [key: string]: number } = {};
        for (const color of cornerColors) {
          const key = color[0] + "," + color[1] + "," + color[2];
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }
        
        const bgColorKey = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])[0][0]
          .split(",")
          .map(Number);
        
        const bgColor = bgColorKey;
        const floodTolerance = Math.max(30, Math.min(60, Math.floor(canvas.width / 20)));
        
        // Create mask using flood fill from corners
        const mask = new Uint8Array(canvas.width * canvas.height);
        
        function floodFill(startX: number, startY: number) {
          const stack = [{ x: startX, y: startY }];
          const visited = new Set<string>();
          
          while (stack.length > 0) {
            const point = stack.pop()!;
            const { x, y } = point;
            const key = x + "," + y;
            
            if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
            if (visited.has(key)) continue;
            
            const idx = (y * canvas.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            
            const diff = Math.abs(r - bgColor[0]) + Math.abs(g - bgColor[1]) + Math.abs(b - bgColor[2]);
            
            if (diff > floodTolerance) continue;
            
            visited.add(key);
            mask[y * canvas.width + x] = 1;
            
            stack.push({ x: x + 1, y });
            stack.push({ x: x - 1, y });
            stack.push({ x, y: y + 1 });
            stack.push({ x, y: y - 1 });
          }
        }
        
        // Fill from all corners
        floodFill(0, 0);
        floodFill(canvas.width - 1, 0);
        floodFill(0, canvas.height - 1);
        floodFill(canvas.width - 1, canvas.height - 1);
        
        // Edge refinement - dilate mask slightly
        const dilatedMask = new Uint8Array(mask.length);
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            if (mask[y * canvas.width + x]) {
              dilatedMask[y * canvas.width + x] = 1;
              dilatedMask[(y - 1) * canvas.width + x] = 1;
              dilatedMask[(y + 1) * canvas.width + x] = 1;
              dilatedMask[y * canvas.width + x - 1] = 1;
              dilatedMask[y * canvas.width + x + 1] = 1;
            }
          }
        }
        
        // Apply alpha to removed background
        for (let i = 0; i < mask.length; i++) {
          if (dilatedMask[i]) {
            data[i * 4 + 3] = 0;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        setResult(dataUrl);
      } catch (err) {
        setError("Failed to process image. Please try a different image.");
        console.error(err);
      }
      setIsProcessing(false);
    };
    
    img.onerror = () => {
      setError("Failed to load image. Please try another one.");
      setIsProcessing(false);
    };
    
    img.src = preview;
  };

  const downloadResult = () => {
    if (!result || !file) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = file.name.replace(/\.[^.]+$/, "_no_bg.png");
    link.click();
    setDownloaded(true);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setDownloaded(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Remove Background</h1>
              <p className="text-sm text-zinc-500">Automatically remove background from images</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {!result ? (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="bg-white rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center cursor-pointer hover:border-zinc-300 transition-colors mb-6"
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl" />
                  <p className="font-medium text-zinc-900">{file?.name}</p>
                  <button onClick={(e) => { e.stopPropagation(); reset(); }} className="text-sm text-red-500 hover:text-red-600">Remove</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">Drop your image here</p>
                    <p className="text-sm text-zinc-500">or click to browse</p>
                  </div>
                  <p className="text-xs text-zinc-400">Works best with images on solid backgrounds</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {file && (
              <button
                onClick={removeBackground}
                disabled={isProcessing}
                className="w-full py-4 bg-black text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Removing Background...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Remove Background
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <p className="font-semibold text-zinc-900">Background Removed!</p>
              </div>
              
              <div className="rounded-xl overflow-hidden" style={{
                backgroundImage: "linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px"
              }}>
                <img src={result} alt="Result" className="w-full" />
              </div>
            </div>
            
            <button
              onClick={downloadResult}
              className="w-full py-4 bg-black text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800"
            >
              <Download className="w-5 h-5" />
              {downloaded ? "Downloaded!" : "Download Image"}
            </button>
            
            <button onClick={reset} className="w-full py-3 text-zinc-600 font-medium">
              Process Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
