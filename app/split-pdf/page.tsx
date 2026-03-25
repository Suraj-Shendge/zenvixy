"use client";

import { useState, useRef } from "react";
import { FileText, Upload, Download, Loader2, X, Plus } from "lucide-react";

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splits, setSplits] = useState<{ from: number; to: number }[]>([{ from: 1, to: 1 }]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ url: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResults([]);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPageCount();
      setPageCount(pages);
      setSplits([{ from: 1, to: Math.ceil(pages / 2) }]);
    }
  };

  const addSplit = () => {
    const lastSplit = splits[splits.length - 1];
    setSplits([...splits, { from: lastSplit.to + 1, to: pageCount }]);
  };

  const removeSplit = (index: number) => {
    if (splits.length > 1) {
      setSplits(splits.filter((_, i) => i !== index));
    }
  };

  const updateSplit = (index: number, field: "from" | "to", value: number) => {
    const newSplits = [...splits];
    newSplits[index][field] = Math.max(1, Math.min(pageCount, value));
    setSplits(newSplits);
  };

  const splitPDF = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newResults: { url: string; name: string }[] = [];

      for (let i = 0; i < splits.length; i++) {
        const { from, to } = splits[i];
        const subDoc = await PDFDocument.create();
        const indices: number[] = [];
        for (let j = from - 1; j < to; j++) {
          indices.push(j);
        }
        const copiedPages = await subDoc.copyPages(pdfDoc, indices);
        copiedPages.forEach(page => subDoc.addPage(page));
        const pdfBytes = await subDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        newResults.push({
          url,
          name: `${file.name.replace(".pdf", "")}_pages_${from}-${to}.pdf`
        });
      }
      setResults(newResults);
    } catch (err) {
      console.error("Error splitting PDF:", err);
      alert("Failed to split PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = () => {
    results.forEach((result, index) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = result.url;
        a.download = result.name;
        a.click();
      }, index * 200);
    });
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setSplits([{ from: 1, to: 1 }]);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Split PDF
            </h1>
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">← Back</a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center cursor-pointer hover:border-red-400 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">Upload a PDF</p>
            <p className="text-sm text-gray-500">Click or drag a PDF file to upload</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{pageCount} pages</p>
                </div>
              </div>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Split into parts</h3>
                <button
                  onClick={addSplit}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <Plus className="w-4 h-4" />
                  Add range
                </button>
              </div>

              {splits.map((split, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 w-20">Part {index + 1}</span>
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={split.from}
                    onChange={(e) => updateSplit(index, "from", parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-center"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={split.to}
                    onChange={(e) => updateSplit(index, "to", parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-center"
                  />
                  <span className="text-sm text-gray-500">({split.to - split.from + 1} pages)</span>
                  {splits.length > 1 && (
                    <button
                      onClick={() => removeSplit(index)}
                      className="text-gray-400 hover:text-red-600 ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!results.length && (
              <button
                onClick={splitPDF}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Splitting...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Split PDF
                  </>
                )}
              </button>
            )}

            {results.length > 0 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Download split files</h3>
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <a
                        key={index}
                        href={result.url}
                        download={result.name}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-gray-700 flex-1">{result.name}</span>
                        <Download className="w-4 h-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
                <button
                  onClick={downloadAll}
                  className="w-full py-4 bg-black text-white rounded-2xl font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download All
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
