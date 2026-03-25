"use client";

import { useState, useEffect } from "react";

export default function QRGenerator() {
  const [text, setText] = useState("https://zenvixy.com");
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    if (text) {
      const encoded = encodeURIComponent(text);
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`);
    }
  }, [text, size]);

  const downloadQR = () => {
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-white"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
            </div>
            <span className="text-lg font-semibold text-black">Zenvixy</span>
          </a>
          <a href="/pricing" className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium">Go Premium</a>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-black mb-2">QR Generator</h1>
        <p className="text-gray-500 mb-8">Create QR codes for any text or URL</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Enter text or URL</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Size: {size}x{size}px</label>
            <input
              type="range"
              min="128"
              max="512"
              step="64"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>128px</span>
              <span>512px</span>
            </div>
          </div>

          {qrUrl && (
            <div className="bg-gray-50 rounded-3xl p-6 text-center">
              <img src={qrUrl} alt="QR Code" className="mx-auto mb-4 rounded-xl" />
              <button
                onClick={downloadQR}
                className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
              >
                Download QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
