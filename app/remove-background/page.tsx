"use client";

import { useState, useRef } from "react";

export default function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl("");
    setError("");
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setResultUrl("");
      setError("");
      setPreview(URL.createObjectURL(f));
    }
  };

  const removeBackground = async () => {
    if (!preview) return;
    setIsProcessing(true);
    setError("");

    try {
      // Create canvas
      const canvas = canvasRef.current;
      if (!canvas) return;

      const img = new window.Image();
      img.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = preview;
      });

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple background removal based on edge detection
      // Get background color from corners
      const corners = [
        [0, 0], // top-left
        [canvas.width - 1, 0], // top-right
        [0, canvas.height - 1], // bottom-left
        [canvas.width - 1, canvas.height - 1], // bottom-right
      ];

      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(([x, y]) => {
        const idx = (y * canvas.width + x) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      bgR /= 4; bgG /= 4; bgB /= 4;

      // Remove similar colors (simple chroma key)
      const threshold = 60;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const diff = Math.sqrt(
          Math.pow(r - bgR, 2) +
          Math.pow(g - bgG, 2) +
          Math.pow(b - bgB, 2)
        );

        if (diff < threshold) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/png");
    } catch (err) {
      setError("Failed to process image. Try a different image.");
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, "_no_bg.png") || "no_background.png";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Remove Background</h1>
        <p className="text-gray-500 mb-6">Remove background from your image</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-cyan-500 transition-colors bg-white"
          >
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <div className="text-4xl mb-4">✂️</div>
            <p className="font-medium text-gray-900">Drop your image here</p>
            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">Works best with solid color backgrounds</p>
          </label>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl p-4">
              <div className="relative max-h-[400px] overflow-hidden rounded-xl bg-checkerboard flex items-center justify-center">
                <img src={preview} alt="Preview" className="max-w-full max-h-[400px]" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Controls */}
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <button
                onClick={removeBackground}
                disabled={isProcessing}
                className="w-full py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 disabled:opacity-50"
              >
                {isProcessing ? "Removing Background..." : "Remove Background"}
              </button>
            </div>

            {/* Result */}
            {resultUrl && (
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Result</h3>
                <div className="relative max-h-[400px] overflow-hidden rounded-xl bg-checkerboard flex items-center justify-center mb-4">
                  <img src={resultUrl} alt="Result" className="max-w-full max-h-[400px]" />
                </div>
                <button
                  onClick={downloadResult}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  Download PNG (Transparent)
                </button>
              </div>
            )}

            <button
              onClick={() => { setFile(null); setPreview(""); setResultUrl(""); setError(""); }}
              className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              Choose Different Image
            </button>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
        
        <style jsx>{`
          .bg-checkerboard {
            background-image: 
              linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
              linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
              linear-gradient(-45deg, transparent 75%, #e5e5e5 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            background-color: #f5f5f5;
          }
        `}</style>
      </div>
    </div>
  );
}
