"use client";

import { useState, useRef } from "react";
import { FileArchive, Download, Loader2, CheckCircle2, Plus, Trash2 } from "lucide-react";

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState<{ start: number; end: number }[]>([{ start: 1, end: 2 }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ url: string; name: string }[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") return;
    setFile(selectedFile);
    setResults([]);
    
    // Get page count
    const arrayBuffer = await selectedFile.arrayBuffer();
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(arrayBuffer);
    setPageCount(pdf.getPageCount());
    
    // Set default range
    setRanges([{ start: 1, end: Math.min(2, pdf.getPageCount()) }]);
  };

  const addRange = () => {
    const lastRange = ranges[ranges.length - 1];
    setRanges([...ranges, { start: lastRange.end + 1, end: Math.min(lastRange.end + 2, pageCount) }]);
  };

  const removeRange = (index: number) => {
    if (ranges.length === 1) return;
    setRanges(ranges.filter((_, i) => i !== index));
  };

  const updateRange = (index: number, field: "start" | "end", value: number) => {
    setRanges(ranges.map((r, i) => (i === index ? { ...r, [field]: Math.max(1, Math.min(value, pageCount)) } : r)));
  };

  const splitPDF = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ranges", JSON.stringify(ranges.map((r) => [r.start - 1, r.end - 1])));

      const res = await fetch("/api/pdf/split", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Split failed");

      const data = await res.json();
      
      if (data.files) {
        // Multiple files returned
        const newResults = data.files.map((f: { name: string; data: string }) => ({
          name: f.name,
          url: `data:application/pdf;base64,${f.data}`,
        }));
        setResults(newResults);
      } else {
        // Single file returned
        const blob = await res.blob();
        setResults([{ url: URL.createObjectURL(blob), name: "split.pdf" }]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to split PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = (result: { url: string; name: string }) => {
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.name;
    a.click();
  };

  const downloadAll = () => {
    results.forEach((r) => downloadResult(r));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <FileArchive className="w-5 h-5 text-white" />
              </div>
              Split PDF
            </h1>
            <p className="text-gray-500 mt-1">Extract pages from your PDF</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <FileArchive className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-gray-700 mb-1">Select a PDF file to split</p>
            <p className="text-sm text-gray-500">Click or drag and drop</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Split Complete!</h2>
              <p className="text-gray-500 mb-6">{results.length} PDF files ready</p>
              <button
                onClick={downloadAll}
                className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mx-auto"
              >
                <Download className="w-5 h-5" />
                Download All
              </button>
              <button
                onClick={() => {
                  results.forEach((r) => URL.revokeObjectURL(r.url));
                  setResults([]);
                  setFile(null);
                }}
                className="mt-4 text-gray-500 hover:text-gray-700"
              >
                Split another file
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <span className="font-medium text-gray-700">{results.length} files created</span>
              </div>
              <div className="divide-y divide-gray-100">
                {results.map((r, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">
                        PDF
                      </div>
                      <span className="font-medium text-gray-900">{r.name}</span>
                    </div>
                    <button
                      onClick={() => downloadResult(r)}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* File Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-sm font-bold text-red-600">
                    PDF
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{pageCount} pages</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Change file
                </button>
              </div>
            </div>

            {/* Page Ranges */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Select Page Ranges</h3>
                <button
                  onClick={addRange}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                  Add range
                </button>
              </div>
              <div className="space-y-3">
                {ranges.map((range, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-6">#{index + 1}</span>
                    <input
                      type="number"
                      min={1}
                      max={pageCount}
                      value={range.start}
                      onChange={(e) => updateRange(index, "start", parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-center"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      min={1}
                      max={pageCount}
                      value={range.end}
                      onChange={(e) => updateRange(index, "end", parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-center"
                    />
                    <span className="text-sm text-gray-400">({range.end - range.start + 1} pages)</span>
                    {ranges.length > 1 && (
                      <button onClick={() => removeRange(index)} className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={splitPDF}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Splitting...
                </>
              ) : (
                <>
                  <FileArchive className="w-5 h-5" />
                  Split PDF
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
