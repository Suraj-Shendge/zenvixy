"use client";

import { useState, useEffect } from "react";
import { Type, Hash, AlignLeft, Clock } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim()).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed

    setStats({
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs: paragraphs || (text.trim() ? 1 : 0),
      readingTime,
    });
  }, [text]);

  const statCards = [
    { label: "Words", value: stats.words, icon: Type },
    { label: "Characters", value: stats.characters, icon: Hash },
    { label: "No Spaces", value: stats.charactersNoSpaces, icon: Hash },
    { label: "Sentences", value: stats.sentences, icon: AlignLeft },
    { label: "Paragraphs", value: stats.paragraphs, icon: AlignLeft },
    { label: "Read Time", value: `${stats.readingTime} min`, icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
              ← Back
            </a>
            <h1 className="text-base font-semibold text-black">Word Counter</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Text Input */}
        <div className="mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            rows={10}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none resize-none"
            autoFocus
          />
        </div>

        {/* Clear Button */}
        {text && (
          <button
            onClick={() => setText("")}
            className="w-full py-2 mb-6 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear text
          </button>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="p-4 bg-gray-50 rounded-xl text-center">
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-gray-400" />
              <p className="text-2xl font-bold text-black">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Reading Progress */}
        {stats.words > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-800">Reading Progress</span>
              <span className="text-sm text-blue-600">{Math.min(100, Math.round((stats.words / 500) * 100))}%</span>
            </div>
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((stats.words / 500) * 100))}%` }}
              />
            </div>
            <p className="text-xs text-blue-600 mt-2">
              {stats.words < 500
                ? `${500 - stats.words} more words to reach average article length`
                : "You've written an average length article!"}
            </p>
          </div>
        )}

        {/* Keywords Density */}
        {stats.words > 10 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-3">Most Common Words</p>
            <div className="flex flex-wrap gap-2">
              {["the", "a", "an", "is", "are", "was", "were", "be", "been", "being"].map((word) => {
                const regex = new RegExp(`\\b${word}\\b`, "gi");
                const count = (text.match(regex) || []).length;
                if (count > 0) {
                  return (
                    <span key={word} className="px-3 py-1 bg-white rounded-lg text-sm">
                      <span className="font-medium text-black">{word}</span>
                      <span className="text-gray-400 ml-1">×{count}</span>
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">
            Your text is never sent anywhere. All analysis happens locally in your browser.
          </p>
        </div>
      </main>
    </div>
  );
}
