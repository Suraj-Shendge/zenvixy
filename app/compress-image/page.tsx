"use client";

import { useState, useRef, useCallback } from "react";
import { Download, Upload, Loader2, Check, Settings } from "lucide-react";

const compressionLevels = [
  { id: "low", label: "Low", quality: 0.9, desc: "Best quality" },
  { id: "medium", label: "Medium", quality: 0.7, desc: "Balanced" },
  { id: "high", label: "High", quality: 0.5, desc: "Smallest size" },
];

export default function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compression, setCompression] = useState("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setResultUrl(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const compressImage = useCallback(() => {
    if (!file || !preview) return;
    setIsProcessing(true);
    const level = compressionLevels.find((l) => l.id === compression)!;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
          setResultSize(blob.size);
        }
        setIsProcessing(false);
      }, "image/jpeg", level.quality);
    };
    img.src = preview;
  }, [file, preview, compression]);

  const watchAd = () => {
    setShowAd(true);
    setTimeout(() => {
      setShowAd(false);
      compressImage();
    }, 5000);
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, "_compressed.jpg") || "image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResultUrl(null);
    setResultSize(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const reduction = originalSize > 0 ? Math.round((1 - resultSize / originalSize) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-sm text-gray-500 hover:text-black">Back</a>
            <h1 className="text-base font-semibold text-black">Compress Image</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {!resultUrl ? (
          <>
            {!file && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
                className={"border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all " + (dragOver ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300")}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium text-black mb-1">Drop image here</p>
                <p className="text-sm text-gray-400">or click to browse</p>
              </div>
            )}

            {file && preview && (
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden bg-gray-100">
                  <img src={preview} alt="Preview" className="w-full h-auto max-h-64 object-contain" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-black">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatSize(originalSize)}</p>
                </div>
              </div>
            )}

            {file && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Compression Level</p>
                <div className="grid grid-cols-3 gap-2">
                  {compressionLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setCompression(level.id)}
                      className={"p-4 rounded-xl text-center transition-colors " + (compression === level.id ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
                    >
                      <p className="font-medium">{level.label}</p>
                      <p className="text-xs text-gray-400">{level.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {file && (
              <div className="mt-6 space-y-3">
                <button onClick={watchAd} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
                  <Settings className="w-5 h-5" />
                  Watch Ad for HD Quality
                </button>
                <button onClick={compressImage} className="w-full py-3 bg-gray-100 text-black rounded-xl font-medium">
                  Compress Standard Quality
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <Check className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-2xl font-bold text-black mb-1">Done!</p>
              <p className="text-gray-500">Reduced by {reduction}%</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-sm text-gray-500">Original</p>
                <p className="font-bold text-black">{formatSize(originalSize)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-sm text-gray-500">Compressed</p>
                <p className="font-bold text-green-600">{formatSize(resultSize)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 py-4 bg-gray-100 text-black rounded-xl font-medium">Compress Another</button>
              <button onClick={downloadResult} className="flex-1 py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />Download
              </button>
            </div>
          </div>
        )}

        {showAd && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6">
            <p className="text-white font-medium mb-2">Watching ad...</p>
            <p className="text-sm text-gray-400">HD quality will unlock when complete</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">All processing happens in your browser.</p>
        </div>
      </main>
    </div>
  );
}
