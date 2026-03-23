"use client";

import { useState } from "react";
import { Download, X, Play, Crown } from "lucide-react";
import Link from "next/link";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  standardUrl: string;
  standardSize: number;
  fileName: string;
  fileType: "pdf" | "image";
  onUnlockHD?: () => void;
  isHDUnlocked?: boolean;
}

export default function ResultModal({
  isOpen,
  onClose,
  standardUrl,
  standardSize,
  fileName,
  fileType,
  onUnlockHD,
  isHDUnlocked,
}: ResultModalProps) {
  const [showAd, setShowAd] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleDownload = () => {
    if (!standardUrl) return;
    const a = document.createElement("a");
    a.href = standardUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
  };

  const handleWatchAd = () => {
    setShowAd(true);
    // Simulate ad watching
    setTimeout(() => {
      setShowAd(false);
      if (onUnlockHD) onUnlockHD();
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-black">Download File</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              fileType === "pdf" ? "bg-red-100" : "bg-blue-100"
            }`}>
              <span className={`text-xs font-bold ${fileType === "pdf" ? "text-red-600" : "text-blue-600"}`}>
                {fileType.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-black truncate">{fileName}</p>
              <p className="text-sm text-gray-500">{formatSize(standardSize)}</p>
            </div>
          </div>

          {/* Quality Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Standard quality ready
            </div>
            {!isHDUnlocked && (
              <p className="text-xs text-gray-400">
                Watch an ad to unlock HD quality
              </p>
            )}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full py-3 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mb-3"
          >
            <Download className="w-5 h-5" />
            Download
          </button>

          {/* Watch Ad for HD */}
          {!isHDUnlocked && (
            <button
              onClick={handleWatchAd}
              className="w-full py-3 bg-gray-100 text-black rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Play className="w-5 h-5" />
              Watch Ad for HD Quality
            </button>
          )}

          {/* Show after download - subtle upgrade prompt */}
          {downloaded && !isHDUnlocked && (
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 text-sm">Want HD Quality?</p>
                  <p className="text-xs text-amber-600 mt-1 mb-2">
                    Watch an ad or upgrade for unlimited HD downloads.
                  </p>
                  <Link
                    href="/pricing"
                    className="text-xs font-medium text-amber-700 hover:text-amber-800 underline"
                  >
                    View Premium →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Files are automatically deleted after download
          </p>
        </div>

        {/* Ad Overlay */}
        {showAd && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-xs aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white/10 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-400">Sponsored</p>
              </div>
            </div>
            <p className="text-white font-medium mb-2">Watching ad...</p>
            <p className="text-sm text-gray-400">HD quality will unlock when complete</p>
          </div>
        )}
      </div>
    </div>
  );
}
