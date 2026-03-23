"use client";

import { useState } from "react";
import { Calendar, PartyPopper } from "lucide-react";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthday: number;
  } | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const today = new Date();
    const birth = new Date(birthDate);
    
    if (birth > today) {
      alert("Birth date cannot be in the future");
      return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate days until next birthday
    let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, totalDays, nextBirthday: daysUntilBirthday });
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
              ← Back
            </a>
            <h1 className="text-base font-semibold text-black">Age Calculator</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Birth Date</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
          />
        </div>

        <button
          onClick={calculateAge}
          disabled={!birthDate}
          className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          <Calendar className="w-5 h-5" />
          Calculate Age
        </button>

        {/* Result */}
        {result && (
          <div className="space-y-6">
            {/* Main Age */}
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <PartyPopper className="w-12 h-12 mx-auto mb-4 text-amber-500" />
              <p className="text-5xl font-bold text-black mb-2">
                {result.years} years old
              </p>
              <p className="text-gray-500">
                or {result.months} months and {result.days} days
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-black">{result.totalDays.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Days Lived</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-black">{result.nextBirthday}</p>
                <p className="text-sm text-gray-500">Days Until Birthday</p>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Fun fact:</span> You've blinked approximately{" "}
                <span className="font-bold">{Math.round(result.totalDays * 6 * 60 * 24 / 4).toLocaleString()}</span>{" "}
                times! 💡
              </p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">
            Your birth date is stored only in your browser and is never sent anywhere.
          </p>
        </div>
      </main>
    </div>
  );
}
