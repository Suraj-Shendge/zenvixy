"use client";

import { X, Download, CheckCircle2 } from "lucide-react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  downloadUrl?: string;
  downloadName?: string;
}

export default function ResultModal({ isOpen, onClose, title, message, downloadUrl, downloadName }: ResultModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadName || "download";
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">{title || "Success!"}</h3>
          <p className="text-gray-500 mb-6">{message || "Your file is ready to download"}</p>
          
          {downloadUrl && (
            <button
              onClick={handleDownload}
              className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
