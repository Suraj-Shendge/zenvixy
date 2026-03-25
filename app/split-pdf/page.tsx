"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileArchive, Download, Upload, Trash2, Loader2, Scissors, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [splitAt, setSplitAt] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);

  const handleFile = async (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResultUrls([]);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      setPdfDoc(doc);
      setTotalPages(doc.getPageCount());
    }
  };

  const processSplit = async () => {
    if (!file || !pdfDoc || splitAt < 1 || splitAt >= totalPages) return;
    setIsProcessing(true);
    try {
      const newDoc1 = await PDFDocument.create();
      const newDoc2 = await PDFDocument.create();
      const pages1 = await newDoc1.copyPages(pdfDoc, Array.from({ length: splitAt }, (_, i) => i));
      const pages2 = await newDoc2.copyPages(pdfDoc, Array.from({ length: totalPages - splitAt }, (_, i) => i + splitAt));
      pages1.forEach(page => newDoc1.addPage(page));
      pages2.forEach(page => newDoc2.addPage(page));
      const url1 = URL.createObjectURL(new Blob([new Uint8Array(await newDoc1.save())], { type: "application/pdf" }));
      const url2 = URL.createObjectURL(new Blob([new Uint8Array(await newDoc2.save())], { type: "application/pdf" }));
      setResultUrls([url1, url2]);
    } catch (e) {
      console.error(e);
    }
    setIsProcessing(false);
  };

  const download = (url: string, index: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(".pdf", `_part${index + 1}.pdf`) || `split_part${index + 1}.pdf`;
    a.click();
  };

  const reset = () => {
    resultUrls.forEach(url => URL.revokeObjectURL(url));
    setFile(null);
    setResultUrls([]);
    setTotalPages(0);
    setSplitAt(1);
    setPdfDoc(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Tools</span>
            </Link>
            <Link href="/pricing" className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium text-sm">
              Go Premium
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Split PDF</h1>
          <p className="text-gray-500">Divide a PDF into two separate files</p>
        </div>

        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0] || null); }}
            onClick={() => document.getElementById("fileInput")?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${dragActive ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
          >
            <input id="fileInput" type="file" accept=".pdf" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} className="hidden" />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="font-medium text-black mb-1">Drop your PDF here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </div>
        ) : resultUrls.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <p className="font-bold text-green-700 mb-2">Split Complete!</p>
              <p className="text-sm text-green-600">Your PDF has been split into 2 files</p>
            </div>
            {resultUrls.map((url, i) => (
              <button key={i} onClick={() => download(url, i)} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800">
                <Download className="w-5 h-5" />
                Download Part {i + 1}
              </button>
            ))}
            <button onClick={reset} className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              Split Another File
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <FileArchive className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="font-medium text-black">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={reset} className="p-2 hover:bg-gray-200 rounded-lg">
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            {totalPages > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="font-medium text-black mb-4">Split after page:</p>
                <div className="flex items-center gap-4">
                  <input type="number" min={1} max={totalPages - 1} value={splitAt} onChange={(e) => setSplitAt(Math.max(1, Math.min(totalPages - 1, parseInt(e.target.value) || 1)))} className="w-24 px-4 py-2 border border-gray-200 rounded-xl text-center" />
                  <span className="text-gray-500">of {totalPages} pages</span>
                </div>
              </div>
            )}
            <button onClick={processSplit} disabled={isProcessing || totalPages < 2} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50">
              {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Splitting...</> : <><Scissors className="w-5 h-5" /> Split PDF</>}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
