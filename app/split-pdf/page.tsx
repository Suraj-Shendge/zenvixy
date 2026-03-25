"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2, Plus, Trash2 } from "lucide-react";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [ranges, setRanges] = useState([{ start: 1, end: 2 }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ name: string; url: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (f: File) => {
    if (f.type === "application/pdf") {
      setFile(f);
      setResults([]);
      
      try {
        const { getDocument } = await import("pdfjs-dist");
        const arrayBuffer = await f.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        setPages(pdf.numPages);
        
        if (pdf.numPages >= 2) {
          const mid = Math.ceil(pdf.numPages / 2);
          setRanges([{ start: 1, end: mid }]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const addRange = () => {
    setRanges([...ranges, { start: ranges[ranges.length - 1]?.end + 1 || 1, end: pages }]);
  };

  const removeRange = (index: number) => {
    if (ranges.length > 1) {
      setRanges(ranges.filter((_, i) => i !== index));
    }
  };

  const updateRange = (index: number, field: "start" | "end", value: number) => {
    const newRanges = [...ranges];
    newRanges[index][field] = Math.max(1, Math.min(pages, value));
    setRanges(newRanges);
  };

  const splitPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResults([]);
    
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const newUrls: { name: string; url: string }[] = [];
      
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const newPdf = await PDFDocument.create();
        
        for (let p = range.start - 1; p < range.end; p++) {
          if (p >= 0 && p < pdfDoc.getPageCount()) {
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [p]);
            newPdf.addPage(copiedPage);
          }
        }
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        
        newUrls.push({
          name: file.name.replace(".pdf", `_part${i + 1}_pages${range.start}-${range.end}.pdf`),
          url,
        });
      }
      
      setResults(newUrls);
    } catch (err) {
      console.error(err);
    }
    setIsProcessing(false);
  };

  const downloadAll = () => {
    results.forEach((r) => {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.name;
      a.click();
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Split PDF</h1>
        <p className="text-gray-500 mb-8">Split PDF into multiple parts</p>

        {results.length === 0 ? (
          <div className="space-y-6">
            <div
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files?.[0])} className="hidden" />
              <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="font-medium text-gray-900">{file ? file.name : "Drop PDF here"}</p>
              {pages > 0 && <p className="text-sm text-gray-500 mt-1">{pages} pages</p>}
            </div>

            {file && pages > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Split into parts</label>
                  <button onClick={addRange} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {ranges.map((range, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-16">Part {index + 1}</span>
                      <input
                        type="number"
                        min={1}
                        max={pages}
                        value={range.start}
                        onChange={(e) => updateRange(index, "start", parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 rounded-lg border border-gray-200"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="number"
                        min={1}
                        max={pages}
                        value={range.end}
                        onChange={(e) => updateRange(index, "end", parseInt(e.target.value) || pages)}
                        className="w-20 px-3 py-2 rounded-lg border border-gray-200"
                      />
                      <span className="text-sm text-gray-400">({range.end - range.start + 1} pages)</span>
                      {ranges.length > 1 && (
                        <button onClick={() => removeRange(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg ml-auto">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={splitPdf}
              disabled={!file || isProcessing}
              className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isProcessing ? "Splitting..." : "Split PDF"}
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8">
            <p className="text-lg font-medium text-gray-900 mb-4">Download parts</p>
            <div className="space-y-2 mb-6">
              {results.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  download={r.name}
                  className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{r.name}</span>
                  <Download className="w-5 h-5 text-gray-400" />
                </a>
              ))}
            </div>
            <button onClick={downloadAll} className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Download All
            </button>
            <button onClick={() => { setResults([]); setFile(null); setPages(0); }} className="w-full py-3 mt-3 text-gray-500 hover:text-gray-700">
              Split another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
