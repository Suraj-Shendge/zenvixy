"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Eraser, AlignLeft, Minus } from "lucide-react";

export default function TextCleaner() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const cleanFunctions = [
    {
      name: "Remove Extra Spaces",
      action: (text: string) => text.replace(/\s+/g, " ").trim(),
      icon: Minus,
    },
    {
      name: "Remove Line Breaks",
      action: (text: string) => text.replace(/\n+/g, " ").trim(),
      icon: AlignLeft,
    },
    {
      name: "Clean All",
      action: (text: string) => text.replace(/\s+/g, " ").replace(/\n+/g, " ").trim(),
      icon: Eraser,
    },
  ];

  const applyClean = (cleanFn: (text: string) => string) => {
    setOutput(cleanFn(input));
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
              ← Back
            </a>
            <h1 className="text-base font-semibold text-black">Text Cleaner</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">{input.length} characters</p>
        </div>

        {/* Clean Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          {cleanFunctions.map((fn) => (
            <button
              key={fn.name}
              onClick={() => applyClean(fn.action)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <fn.icon className="w-4 h-4" />
              {fn.name}
            </button>
          ))}
        </div>

        {/* Output */}
        {output && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cleaned Text</label>
              <textarea
                value={output}
                readOnly
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">{output.length} characters</p>
            </div>

            <button
              onClick={copyOutput}
              className="w-full py-3 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">
            All processing happens in your browser. Your text is never sent to any server.
          </p>
        </div>
      </main>
    </div>
  );
}
