"use client";

import { useState } from "react";
import { Calculator, ArrowUpDown } from "lucide-react";

type Category = "length" | "weight" | "temperature" | "volume";

interface Unit {
  name: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const units: Record<Category, Unit[]> = {
  length: [
    { name: "Meter", symbol: "m", toBase: (v) => v, fromBase: (v) => v },
    { name: "Kilometer", symbol: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: "Centimeter", symbol: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { name: "Millimeter", symbol: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "Mile", symbol: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { name: "Yard", symbol: "yd", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { name: "Foot", symbol: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: "Inch", symbol: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { name: "Kilogram", symbol: "kg", toBase: (v) => v, fromBase: (v) => v },
    { name: "Gram", symbol: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "Milligram", symbol: "mg", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { name: "Pound", symbol: "lb", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { name: "Ounce", symbol: "oz", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  ],
  temperature: [
    { name: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
    { name: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    { name: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  volume: [
    { name: "Liter", symbol: "L", toBase: (v) => v, fromBase: (v) => v },
    { name: "Milliliter", symbol: "mL", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "Gallon (US)", symbol: "gal", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { name: "Quart", symbol: "qt", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { name: "Pint", symbol: "pt", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    { name: "Cup", symbol: "cup", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
  ],
};

const categories: { value: Category; label: string }[] = [
  { value: "length", label: "Length" },
  { value: "weight", label: "Weight" },
  { value: "temperature", label: "Temperature" },
  { value: "volume", label: "Volume" },
];

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState(units.length[0]);
  const [toUnit, setToUnit] = useState(units.length[1]);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setFromUnit(units[newCategory][0]);
    setToUnit(units[newCategory][1]);
    setFromValue("");
    setToValue("");
  };

  const convert = (value: string, direction: "from" | "to") => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      if (direction === "from") setToValue("");
      else setFromValue("");
      return;
    }

    if (direction === "from") {
      const baseValue = fromUnit.toBase(num);
      const result = toUnit.fromBase(baseValue);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ""));
    } else {
      const baseValue = toUnit.toBase(num);
      const result = fromUnit.fromBase(baseValue);
      setFromValue(result.toFixed(6).replace(/\.?0+$/, ""));
    }
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    const tempValue = fromValue;
    setFromValue(toValue);
    setToValue(tempValue);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
              ← Back
            </a>
            <h1 className="text-base font-semibold text-black">Unit Converter</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Category Selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                category === cat.value
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="space-y-6">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="flex gap-3">
              <input
                type="number"
                value={fromValue}
                onChange={(e) => {
                  setFromValue(e.target.value);
                  convert(e.target.value, "from");
                }}
                placeholder="Enter value"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
              />
              <select
                value={fromUnit.symbol}
                onChange={(e) => {
                  const unit = units[category].find((u) => u.symbol === e.target.value);
                  if (unit) setFromUnit(unit);
                }}
                className="w-28 px-3 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none bg-white"
              >
                {units[category].map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>
                    {unit.symbol}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-500 mt-1">{fromUnit.name}</p>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="flex gap-3">
              <input
                type="number"
                value={toValue}
                onChange={(e) => {
                  setToValue(e.target.value);
                  convert(e.target.value, "to");
                }}
                placeholder="Result"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
              />
              <select
                value={toUnit.symbol}
                onChange={(e) => {
                  const unit = units[category].find((u) => u.symbol === e.target.value);
                  if (unit) setToUnit(unit);
                }}
                className="w-28 px-3 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none bg-white"
              >
                {units[category].map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>
                    {unit.symbol}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-500 mt-1">{toUnit.name}</p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">
            All conversions are calculated locally in your browser.
          </p>
        </div>
      </main>
    </div>
  );
}
