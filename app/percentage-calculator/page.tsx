"use client";

import { useState } from "react";
import { Percent, Calculator } from "lucide-react";

type CalcMode = "whatIsXofY" | "whatPercentXofY" | "XisWhatPercentOfY" | "percentChange";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<CalcMode>("whatIsXofY");
  const [values, setValues] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState<number | null>(null);

  const modes: { value: CalcMode; label: string }[] = [
    { value: "whatIsXofY", label: "What is X% of Y?" },
    { value: "whatPercentXofY", label: "X is what % of Y?" },
    { value: "XisWhatPercentOfY", label: "X is what % of Y?" },
    { value: "percentChange", label: "Percent Change" },
  ];

  const calculate = () => {
    const { x, y } = values;
    let res = 0;

    switch (mode) {
      case "whatIsXofY":
        res = (x / 100) * y;
        break;
      case "whatPercentXofY":
      case "XisWhatPercentOfY":
        res = y > 0 ? (x / y) * 100 : 0;
        break;
      case "percentChange":
        res = y > 0 ? ((x - y) / y) * 100 : 0;
        break;
    }

    setResult(res);
  };

  const getResultLabel = () => {
    switch (mode) {
      case "whatIsXofY":
        return `${values.x}% of ${values.y} =`;
      case "whatPercentXofY":
        return `${values.x} is ${result?.toFixed(2)}% of ${values.y}`;
      case "XisWhatPercentOfY":
        return `${values.x} is ${result?.toFixed(2)}% of ${values.y}`;
      case "percentChange":
        return `Change from ${values.y} to ${values.x} = ${result?.toFixed(2)}%`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
              ← Back
            </a>
            <h1 className="text-base font-semibold text-black">Percentage Calculator</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Mode Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Type</label>
          <div className="grid grid-cols-1 gap-2">
            {modes.map((m) => (
              <button
                key={m.value}
                onClick={() => { setMode(m.value); setResult(null); }}
                className={`p-3 rounded-xl text-sm font-medium text-left transition-colors ${
                  mode === m.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === "whatIsXofY" || mode === "whatPercentXofY" ? "Percentage (%)" : "From Value"}
            </label>
            <input
              type="number"
              value={values.x || ""}
              onChange={(e) => setValues({ ...values, x: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === "whatIsXofY" ? "Total Value" : "To Value"}
            </label>
            <input
              type="number"
              value={values.y || ""}
              onChange={(e) => setValues({ ...values, y: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mb-6"
        >
          <Calculator className="w-5 h-5" />
          Calculate
        </button>

        {/* Result */}
        {result !== null && (
          <div className="p-6 bg-gray-50 rounded-2xl text-center">
            <Percent className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-3xl font-bold text-black mb-2">
              {mode === "whatIsXofY" ? result.toFixed(2) : `${result.toFixed(2)}%`}
            </p>
            <p className="text-gray-500">{getResultLabel()}</p>
          </div>
        )}

        {/* Quick Examples */}
        <div className="mt-8">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick Examples</p>
          <div className="space-y-2">
            <button
              onClick={() => { setMode("whatIsXofY"); setValues({ x: 15, y: 200 }); }}
              className="w-full p-3 bg-gray-50 rounded-xl text-left text-sm hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-600">What is </span>
              <span className="font-semibold text-black">15%</span>
              <span className="text-gray-600"> of </span>
              <span className="font-semibold text-black">200</span>
              <span className="text-gray-600">? → 30</span>
            </button>
            <button
              onClick={() => { setMode("XisWhatPercentOfY"); setValues({ x: 50, y: 200 }); }}
              className="w-full p-3 bg-gray-50 rounded-xl text-left text-sm hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-600">50 is what percent of </span>
              <span className="font-semibold text-black">200</span>
              <span className="text-gray-600">? → 25%</span>
            </button>
            <button
              onClick={() => { setMode("percentChange"); setValues({ x: 150, y: 100 }); }}
              className="w-full p-3 bg-gray-50 rounded-xl text-left text-sm hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-600">Change from </span>
              <span className="font-semibold text-black">100</span>
              <span className="text-gray-600"> to </span>
              <span className="font-semibold text-black">150</span>
              <span className="text-gray-600">? → 50%</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">
            All calculations are done locally in your browser.
          </p>
        </div>
      </main>
    </div>
  );
}
