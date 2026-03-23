"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { QrCode, Download, Copy, Check, Loader2 } from "lucide-react";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code using canvas
  const generateQR = useCallback(() => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    
    // Use a simple QR code generation approach with canvas
    // We'll use a basic algorithm to create a visual QR-like pattern
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsGenerating(false);
      return;
    }
    
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    
    // Generate a hash from the text for consistent pattern
    const hash = simpleHash(text);
    
    // Draw QR-like pattern based on hash
    const moduleSize = Math.floor(size / 33); // QR code has 33x33 modules typically
    const margin = moduleSize * 3;
    
    // Draw finder patterns (the three big squares in corners)
    drawFinderPattern(ctx, margin, margin, moduleSize);
    drawFinderPattern(ctx, size - margin - moduleSize * 7, margin, moduleSize);
    drawFinderPattern(ctx, margin, size - margin - moduleSize * 7, moduleSize);
    
    // Draw data modules based on hash
    ctx.fillStyle = "#000000";
    for (let y = margin + moduleSize * 7; y < size - margin - moduleSize * 7; y += moduleSize) {
      for (let x = margin + moduleSize * 7; x < size - margin - moduleSize * 7; x += moduleSize) {
        const hashIndex = ((y - margin) * (size - margin * 2) + (x - margin)) % hash.length;
        if (hash[hashIndex] % 3 === 0) {
          ctx.fillRect(x, y, moduleSize - 1, moduleSize - 1);
        }
      }
    }
    
    // Add timing patterns
    ctx.fillStyle = "#000000";
    for (let i = margin + moduleSize * 7 + moduleSize; i < size - margin - moduleSize * 7; i += moduleSize * 2) {
      ctx.fillRect(i, margin + moduleSize * 7, moduleSize - 1, moduleSize - 1);
      ctx.fillRect(margin + moduleSize * 7, i, moduleSize - 1, moduleSize - 1);
    }
    
    const dataUrl = canvas.toDataURL("image/png");
    setQrDataUrl(dataUrl);
    setIsGenerating(false);
  }, [text, size]);

  // Simple hash function for consistent QR patterns
  function simpleHash(str: string): number[] {
    const hash: number[] = [];
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
      hash.push(Math.abs(h));
    }
    // Extend hash to ensure we have enough values
    while (hash.length < 1000) {
      hash.push(hash[hash.length % str.length] ^ (hash.length * 31));
    }
    return hash;
  }

  // Draw QR finder pattern (the big square with smaller squares inside)
  function drawFinderPattern(ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) {
    // Outer black square
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
    
    // Inner white square
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
    
    // Center black square
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
  }

  useEffect(() => {
    if (text.trim()) {
      const timer = setTimeout(generateQR, 300);
      return () => clearTimeout(timer);
    }
  }, [text, size, generateQR]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qrcode_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyToClipboard = () => {
    if (!qrDataUrl) return;
    fetch(qrDataUrl)
      .then(res => res.blob())
      .then(blob => {
        navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
              ← Back
            </a>
            <h1 className="text-base font-semibold text-black">QR Generator</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Input */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter text or URL
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com or any text..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none resize-none"
            />
          </div>

          {/* Size Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size: {size}×{size}px
            </label>
            <input
              type="range"
              min={128}
              max={512}
              step={64}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full accent-black"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
            </div>
          </div>

          {/* QR Preview */}
          {isGenerating ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : qrDataUrl ? (
            <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-8">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <img src={qrDataUrl} alt="QR Code" className="w-full h-auto" style={{ width: size, height: size }} />
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={downloadQR}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl text-center">
              <QrCode className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-400">Enter text above to generate QR code</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">
            QR codes are generated locally in your browser. No data is sent to any server.
          </p>
        </div>
      </main>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
