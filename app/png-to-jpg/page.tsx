"use client";

import { useState, useRef, useCallback } from "react";
import { Image, Upload, Check, Download } from "lucide-react";

export default function PNGtoJPG() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setResultUrl(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const convertImage = useCallback(() => {
    if (!preview) return;
    setIsProcessing(true);
    
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/jpeg", 0.92);
    };
    img.src = preview;
  }, [preview]);

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, ".jpg") || "converted.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResultUrl(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-sm text-gray-500 hover:text-black">Back</a>
            <h1 className="text-base font-semibold text-black">PNG to JPG</h1>
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
                <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium text-black mb-1">Drop image here</p>
                <p className="text-sm text-gray-400">or click to browse</p>
              </div>
            )}

            {file && preview && (
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden bg-gray-100">
                  <img src={preview} alt="Preview" className="w-full h-auto max-h-64 object-contain" />
                </div>
                <p className="text-center text-sm text-gray-500">{file.name}</p>
                <button onClick={convertImage} className="w-full py-4 bg-black text-white rounded-xl font-medium">
                  Convert to JPG
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <Check className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-2xl font-bold text-black mb-1">Done!</p>
              <p className="text-gray-500">Image converted to JPG</p>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 py-4 bg-gray-100 text-black rounded-xl font-medium">Convert Another</button>
              <button onClick={downloadResult} className="flex-1 py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />Download
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">All processing happens in your browser.</p>
        </div>
      </main>
    </div>
  );
}
