"use client";

import { useState, useRef } from "react";
import { Scissors, Upload, Download, Loader2 } from "lucide-react";

export default function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeBackground = async () => {
    if (!file || !preview) return;
    setLoading(true);
    setProcessing(true);
    setProgress(0);

    try {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/index.min.js";
      script.async = true;

      script.onload = async () => {
        setProgress(20);
        try {
          // @ts-ignore
          const removeBackground = await window.bgRemove;
          setProgress(40);
          
          const inputBlob = await fetch(preview).then(r => r.blob());
          setProgress(60);
          
          const resultBlob = await removeBackground(inputBlob);
          setProgress(80);
          
          const resultUrl = URL.createObjectURL(resultBlob);
          setResult(resultUrl);
          setProgress(100);
        } catch (err) {
          console.error("Error removing background:", err);
          alert("Failed to remove background. Please try again.");
        } finally {
          setLoading(false);
          setProcessing(false);
        }
      };

      script.onerror = () => {
        alert("Failed to load background removal library. Please check your internet connection.");
        setLoading(false);
        setProcessing(false);
      };

      document.head.appendChild(script);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = file?.name.replace(/\.[^.]+$/, "_no_bg.png") || "removed_background.png";
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setLoading(false);
    setProcessing(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              Remove Background
            </h1>
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">← Back</a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center cursor-pointer hover:border-violet-400 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">Upload an image</p>
            <p className="text-sm text-gray-500">Click or drag an image to upload</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl p-4">
              <div className="relative rounded-xl overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlMGUwZTAiLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmNmY2ZjYiLz48L3N2Zz4=')]">
                <img src={preview} alt="Preview" className="w-full max-h-96 object-contain mx-auto" />
              </div>
              <button onClick={reset} className="mt-4 w-full py-3 text-sm text-gray-500 hover:text-gray-700">
                Remove & try another
              </button>
            </div>

            {/* Process Button */}
            {!result && (
              <button
                onClick={removeBackground}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {processing ? `Processing... ${progress}%` : "Loading..."}
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    Remove Background
                  </>
                )}
              </button>
            )}

            {/* Result */}
            {result && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4">
                  <div className="relative rounded-xl overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlMGUwZTAiLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmNmY2ZjYiLz48L3N2Zz4=')]">
                    <img src={result} alt="Result" className="w-full max-h-96 object-contain mx-auto" />
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-4 bg-black text-white rounded-2xl font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
