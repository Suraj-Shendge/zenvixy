"use client";

import { useState, useRef } from "react";

export default function PngToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl("");
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setResultUrl("");
      setPreview(URL.createObjectURL(f));
    }
  };

  const convertToJpg = () => {
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

      // Fill with background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/jpeg", 0.95);
    };
    img.src = preview;
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, ".jpg") || "converted.jpg";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">PNG to JPG</h1>
        <p className="text-gray-500 mb-6">Convert PNG images to JPG format</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-pink-500 transition-colors bg-white"
          >
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <div className="text-4xl mb-4">🎨</div>
            <p className="font-medium text-gray-900">Drop your image here</p>
            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
          </label>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl p-4">
              <div 
                className="relative max-h-[400px] overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center"
                style={{ backgroundColor: bgColor }}
              >
                <img src={preview} alt="Preview" className="max-w-full max-h-[400px]" />
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Background Color</label>
                <div className="flex gap-2">
                  {["#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setBgColor(c)}
                      className={`w-10 h-10 rounded-xl border-2 ${
                        bgColor === c ? "border-pink-500" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={convertToJpg}
                disabled={isProcessing}
                className="w-full py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 disabled:opacity-50"
              >
                {isProcessing ? "Converting..." : "Convert to JPG"}
              </button>
            </div>

            {/* Result */}
            {resultUrl && (
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Result</h3>
                <div 
                  className="relative max-h-[400px] overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center mb-4"
                  style={{ backgroundColor: bgColor }}
                >
                  <img src={resultUrl} alt="Result" className="max-w-full max-h-[400px]" />
                </div>
                <button
                  onClick={downloadResult}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  Download JPG
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
