"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl("");
    setError("");
    setProgress(0);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setResultUrl("");
      setError("");
      setProgress(0);
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const removeBackground = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");
    setProgress(0);

    try {
      const removeBackground = await import("@imgly/background-removal").then(m => m.default);
      
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          if (key === "compute:inference") {
            setProgress(Math.round((current / total) * 100));
          }
        },
        output: {
          format: "image/png",
          quality: 1,
        },
      });

      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setIsProcessing(false);
      setProgress(100);
    } catch (err) {
      console.error("Background removal failed:", err);
      setError("Failed to remove background. Please try a different image.");
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, "_nobg.png") || "removed_background.png";
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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Remove Background</h1>
        <p className="text-gray-500 mb-8">AI-powered background removal for images</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all bg-white"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>
            <p className="font-semibold text-gray-900 text-lg mb-2">Drop your image here</p>
            <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            <p className="text-xs text-gray-400">Supports JPG, PNG • Best results with clear subject</p>
          </label>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="bg-white rounded-2xl p-4">
              <div className="relative rounded-xl overflow-hidden bg-checkerboard flex items-center justify-center min-h-64">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-80 object-contain"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Progress */}
            {isProcessing && (
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <span className="font-medium text-gray-900">Removing background...</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
              </div>
            )}

            {/* Remove Button */}
            {!resultUrl && !isProcessing && (
              <button
                onClick={removeBackground}
                className="w-full py-4 bg-purple-600 text-white rounded-2xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Remove Background
              </button>
            )}

            {/* Result */}
            {resultUrl && (
              <div className="bg-white rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Background Removed!</span>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-checkerboard flex items-center justify-center min-h-64 mb-4">
                  <img
                    src={resultUrl}
                    alt="Result"
                    className="max-w-full max-h-80 object-contain"
                  />
                </div>
                <button
                  onClick={downloadResult}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
              </div>
            )}

            {/* Reset */}
            <button
              onClick={() => {
                setFile(null);
                setPreview("");
                setResultUrl("");
                setError("");
                setProgress(0);
              }}
              className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              Process Another Image
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-checkerboard {
          background-image:
            linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
            linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
            linear-gradient(-45deg, transparent 75%, #e5e5e5 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          background-color: #fafafa;
        }
      `}</style>
    </div>
  );
}
