"use client";

import { useState, useRef } from "react";

export default function RotateFlip() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl("");
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
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

  const applyTransform = () => {
    if (!preview) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let w = img.width;
      let h = img.height;
      
      // Adjust canvas size for rotation
      if (rotation === 90 || rotation === 270) {
        canvas.width = h;
        canvas.height = w;
      } else {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -w / 2, -h / 2);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/png");
    };
    img.src = preview;
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, "_transformed.png") || "transformed.png";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Rotate & Flip</h1>
        <p className="text-gray-500 mb-6">Rotate or flip your image</p>

        {!file ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-500 transition-colors bg-white"
          >
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <div className="text-4xl mb-4">🔄</div>
            <p className="font-medium text-gray-900">Drop your image here</p>
            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
          </label>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl p-4">
              <div 
                className="relative max-h-[400px] overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center"
                style={{ 
                  transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                }}
              >
                <img src={preview} alt="Preview" className="max-w-full max-h-[400px]" />
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Rotation</label>
                <div className="flex gap-2">
                  {[0, 90, 180, 270].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRotation(r)}
                      className={`flex-1 py-2 rounded-xl font-medium ${
                        rotation === r ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {r}°
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Flip</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFlipH(!flipH)}
                    className={`flex-1 py-3 rounded-xl font-medium ${
                      flipH ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ↔️ Horizontal
                  </button>
                  <button
                    onClick={() => setFlipV(!flipV)}
                    className={`flex-1 py-3 rounded-xl font-medium ${
                      flipV ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ↕️ Vertical
                  </button>
                </div>
              </div>

              <button
                onClick={applyTransform}
                disabled={isProcessing}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Apply"}
              </button>
            </div>

            {/* Result */}
            {resultUrl && (
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Result</h3>
                <img src={resultUrl} alt="Result" className="max-w-full mx-auto rounded-xl mb-4" />
                <button
                  onClick={downloadResult}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  Download
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
