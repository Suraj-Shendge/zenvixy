"use client";

import { useState, useRef } from "react";
import { Upload, Download, Image as ImageIcon, Loader2, CheckCircle2, X } from "lucide-react";

export default function PngToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const convertToJpg = async () => {
    if (!file || !preview) return;
    setIsProcessing(true);

    try {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        
        // Fill with background color (for transparent PNGs)
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setResult({ url, size: blob.size });
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
    a.href = result.url;
    a.download = file?.name.replace(/\.[^.]+$/, ".jpg") || "converted.jpg";
    a.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const reduction = file && result ? Math.round((1 - result.size / file.size) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              PNG to JPG
            </h1>
            <p className="text-gray-500 mt-1">Convert PNG images to JPG format</p>
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
              accept="image/png,image/*"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-gray-700 mb-1">Drop a PNG image or click to upload</p>
            <p className="text-sm text-gray-500">PNG, JPG, WebP supported</p>
          </div>
        ) : result ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Converted!</h2>
            <div className="flex items-center justify-center gap-8 my-6">
              <div>
                <p className="text-sm text-gray-500">Original (PNG)</p>
                <p className="font-semibold text-gray-700">{formatSize(file.size)}</p>
              </div>
              <div className="text-gray-300">→</div>
              <div>
                <p className="text-sm text-gray-500">Converted (JPG)</p>
                <p className="font-semibold text-green-600">{formatSize(result.size)}</p>
              </div>
            </div>
            {reduction > 0 && (
              <p className="text-sm text-gray-500 mb-6">File size reduced by {reduction}%</p>
            )}
            <button
              onClick={downloadResult}
              className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mx-auto"
            >
              <Download className="w-5 h-5" />
              Download JPG
            </button>
            <button
              onClick={() => {
                URL.revokeObjectURL(result.url);
                setResult(null);
                setFile(null);
                setPreview(null);
              }}
              className="mt-4 text-gray-500 hover:text-gray-700"
            >
              Convert another
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={preview!} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
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
            </div>

            {/* Background Color */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <label className="font-medium text-gray-900 mb-3 block">Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 font-mono"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Used to fill transparent areas</p>
            </div>

            <button
              onClick={convertToJpg}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Convert to JPG
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
