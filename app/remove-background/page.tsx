"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Download, ArrowLeft, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import Link from "next/link";

export default function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const removeFnRef = useRef<any>(null);

  // Load imgly library from CDN
  useEffect(() => {
    const loadLibrary = async () => {
      if (typeof window !== "undefined" && !(window as any).removeBackground) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/index.umd.min.js";
        script.async = true;
        script.onload = () => setModelLoaded(true);
        script.onerror = () => setError("Failed to load AI model");
        document.head.appendChild(script);
      } else {
        setModelLoaded(true);
      }
    };
    loadLibrary();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl("");
    setError("");
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setResultUrl("");
      setError("");
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const removeBackground = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");
    setProgress(0);

    try {
      const removeBackground = (window as any).removeBackground;
      if (!removeBackground) {
        throw new Error("AI model not loaded. Please refresh and try again.");
      }

      const result = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            setProgress(Math.round((current / total) * 100));
          }
        },
        output: {
          format: "image/png",
          quality: 1,
        },
      });

      // Convert blob to data URL
      const reader = new FileReader();
      reader.onload = () => {
        setResultUrl(reader.result as string);
        setIsProcessing(false);
        setProgress(100);
      };
      reader.onerror = () => {
        throw new Error("Failed to process result");
      };
      reader.readAsDataURL(result);
    } catch (err: any) {
      setError(err.message || "Failed to remove background");
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, "_no_bg.png") || "result.png";
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPreview("");
    setResultUrl("");
    setError("");
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Remove Background</h1>
            <p className="text-sm text-gray-500">AI-powered • 100% Private</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {!resultUrl ? (
          <div className="space-y-6">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                preview
                  ? "border-green-400 bg-green-50 hover:bg-green-100"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl" />
                  <button
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-1">Drop your image here</p>
                  <p className="text-sm text-gray-400">or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, WebP</p>
                </>
              )}
            </div>

            {file && (
              <button
                onClick={removeBackground}
                disabled={isProcessing || !modelLoaded}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Removing background... {progress}%
                  </>
                ) : !modelLoaded ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading AI Model...
                  </>
                ) : (
                  "Remove Background"
                )}
              </button>
            )}

            {isProcessing && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>100% Private • Files never leave your device</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-2xl p-4 relative">
              <img src={resultUrl} alt="Result" className="max-h-[500px] mx-auto rounded-xl" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadResult}
                className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800"
              >
                <Download className="w-5 h-5" />
                Download PNG
              </button>
              <button
                onClick={reset}
                className="px-6 py-4 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                New Image
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No watermarks • High quality output</span>
            </div>
          </div>
        )}
      </main>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
