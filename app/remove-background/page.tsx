"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, Scissors, Loader2, CheckCircle2, X, Sparkles } from "lucide-react";

export default function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const removeBackground = async () => {
    if (!file || !preview) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Load @imgly/background-removal from CDN
      const { removeBackground } = await import("@imgly/background-removal");

      const blob = await removeBackground(preview, {
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
      setResult(url);
    } catch (err) {
      console.error(err);
      setError("Failed to remove background. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = file?.name.replace(/\.[^.]+$/, "_no_bg.png") || "removed_background.png";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              Remove Background
            </h1>
            <p className="text-gray-500 mt-1">AI-powered background removal</p>
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
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-gray-700 mb-1">Drop an image or click to upload</p>
            <p className="text-sm text-gray-500">JPG, PNG supported</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Background Removed!</h2>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-checkerboard rounded-xl">
                  <img src={result} alt="Result" className="max-h-64 rounded-lg" />
                </div>
              </div>
              <button
                onClick={downloadResult}
                className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mx-auto"
              >
                <Download className="w-5 h-5" />
                Download PNG
              </button>
              <button
                onClick={() => {
                  URL.revokeObjectURL(result);
                  setResult(null);
                  setFile(null);
                  setPreview(null);
                }}
                className="mt-4 text-gray-500 hover:text-gray-700"
              >
                Process another
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={preview!} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">Ready to process</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-checkerboard rounded-xl p-4">
                <img src={preview!} alt="Preview" className="w-full max-h-64 object-contain rounded-lg" />
              </div>
            </div>

            {/* Progress */}
            {isProcessing && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  <span className="font-medium text-gray-900">Processing...</span>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-center">
                {error}
              </div>
            )}

            <button
              onClick={removeBackground}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Removing background...
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5" />
                  Remove Background
                </>
              )}
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
