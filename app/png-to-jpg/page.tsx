"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, ArrowLeft, CheckCircle } from "lucide-react";

export default function PngToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl("");
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.type === "image/png" || f.type.includes("image"))) {
      setFile(f);
      setResultUrl("");
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const convertToJpg = () => {
    if (!preview) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fill with background color (transparency becomes this color)
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
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">PNG to JPG</h1>
        <p className="text-gray-500 mb-8">Convert PNG images to JPG format</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50/50 transition-all bg-white"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-pink-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-pink-600" />
            </div>
            <p className="font-semibold text-gray-900 text-lg mb-2">Drop your PNG here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </label>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl p-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center min-h-64">
                <img src={preview} alt="Preview" className="max-w-full max-h-72 object-contain" />
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">{file.name}</p>
            </div>

            {/* Background Color */}
            <div className="bg-white rounded-2xl p-4">
              <p className="font-medium text-gray-900 mb-3">Background Color (for transparency)</p>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-mono"
                />
                <button
                  onClick={() => setBgColor("#FFFFFF")}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  White
                </button>
              </div>
            </div>

            {/* Result */}
            {resultUrl && (
              <div className="bg-white rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Conversion Complete!</span>
                </div>
                <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center mb-4" style={{ backgroundColor: bgColor }}>
                  <img src={resultUrl} alt="Result" className="max-w-full max-h-72 object-contain" />
                </div>
                <button
                  onClick={downloadResult}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download JPG
                </button>
              </div>
            )}

            {/* Convert Button */}
            {!resultUrl && (
              <button
                onClick={convertToJpg}
                disabled={isProcessing}
                className="w-full py-4 bg-pink-600 text-white rounded-2xl font-semibold hover:bg-pink-700 disabled:opacity-50"
              >
                {isProcessing ? "Converting..." : "Convert to JPG"}
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
