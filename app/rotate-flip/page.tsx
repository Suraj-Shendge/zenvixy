"use client";

import { useState, useRef, useCallback } from "react";
import { RotateCw, FlipHorizontal2, FlipVertical2, Upload, Download, Check } from "lucide-react";

interface Transform {
  rotate: number;
  flipH: boolean;
  flipV: boolean;
}

export default function RotateFlip() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transform, setTransform] = useState<Transform>({ rotate: 0, flipH: false, flipV: false });
  const [downloaded, setDownloaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
        setResult(null);
        setDownloaded(false);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
        setResult(null);
        setDownloaded(false);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const processImage = useCallback(() => {
    if (!preview) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      let { width, height } = img;
      
      canvas.width = width;
      canvas.height = height;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(width / 2, height / 2);
      ctx.rotate((transform.rotate * Math.PI) / 180);
      ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
      ctx.translate(-img.width / 2, -img.height / 2);
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      setResult(dataUrl);
      setIsProcessing(false);
      setDownloaded(false);
    };
    img.src = preview;
  }, [preview, transform]);

  const downloadResult = () => {
    if (!result || !file) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = file.name.replace(/\.[^.]+$/, "_transformed.png");
    link.click();
    setDownloaded(true);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setDownloaded(false);
    setTransform({ rotate: 0, flipH: false, flipV: false });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <RotateCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Rotate & Flip</h1>
              <p className="text-sm text-zinc-500">Rotate and flip your images</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="bg-white rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center cursor-pointer hover:border-zinc-300 transition-colors mb-6"
        >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          {preview ? (
            <div className="space-y-4">
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl" />
              <p className="font-medium text-zinc-900">{file?.name}</p>
              <button onClick={(e) => { e.stopPropagation(); reset(); }} className="text-sm text-red-500 hover:text-red-600">Remove</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-zinc-400" />
              </div>
              <div>
                <p className="font-medium text-zinc-900">Drop your image here</p>
                <p className="text-sm text-zinc-500">or click to browse</p>
              </div>
            </div>
          )}
        </div>

        {file && (
          <>
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Transform Options</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-600 mb-2 block">Rotation</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="90"
                      value={transform.rotate}
                      onChange={(e) => setTransform({ ...transform, rotate: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="w-16 text-center font-medium">{transform.rotate} deg</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[0, 90, 180, 270, 360].map((angle) => (
                      <button
                        key={angle}
                        onClick={() => setTransform({ ...transform, rotate: angle })}
                        className={"px-3 py-1 text-sm rounded-lg " + (transform.rotate === angle ? "bg-black text-white" : "bg-zinc-100 text-zinc-600")}
                      >
                        {angle} deg
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-zinc-600 mb-2 block">Flip</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTransform({ ...transform, flipH: !transform.flipH })}
                      className={"flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-colors " + (transform.flipH ? "border-pink-500 bg-pink-50 text-pink-600" : "border-zinc-200 text-zinc-600")}
                    >
                      <FlipHorizontal2 className="w-5 h-5" />
                      Horizontal
                    </button>
                    <button
                      onClick={() => setTransform({ ...transform, flipV: !transform.flipV })}
                      className={"flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-colors " + (transform.flipV ? "border-pink-500 bg-pink-50 text-pink-600" : "border-zinc-200 text-zinc-600")}
                    >
                      <FlipVertical2 className="w-5 h-5" />
                      Vertical
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {!result ? (
              <button
                onClick={processImage}
                disabled={isProcessing}
                className="w-full py-4 bg-black text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RotateCw className="w-5 h-5" />
                    Apply Transform
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="font-semibold text-zinc-900">Transformation Complete!</p>
                  </div>
                  <img src={result} alt="Result" className="rounded-xl w-full" />
                </div>
                <button
                  onClick={downloadResult}
                  className="w-full py-4 bg-black text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800"
                >
                  <Download className="w-5 h-5" />
                  {downloaded ? "Downloaded!" : "Download Image"}
                </button>
                <button onClick={reset} className="w-full py-3 text-zinc-600 font-medium">
                  Transform Another Image
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
