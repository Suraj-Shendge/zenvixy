"use client";

import { useState, useEffect } from "react";
import { Type, Copy, CheckCheck, Crown, Zap, X, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIUsageTracker from "@/components/AIUsageTracker";
import RecommendedTools from "@/components/RecommendedTools";

const bioTemplates = [
  { style: "Professional", examples: [
    "Digital creator | Building the future | Tech enthusiast",
    "Designer by day, dreamer by night | Creating meaningful experiences",
    "Problem solver | Innovation advocate | Change maker"
  ]},
  { style: "Creative", examples: [
    "Turning coffee into code since 2019 ☕ | Pixel perfectionist",
    "Artist | Wanderer | Storyteller | Making magic happen",
    "Creating my own sunshine 🌟 | Dreamer | Doer"
  ]},
  { style: "Minimal", examples: [
    "Less is more",
    "Simplicity is the ultimate sophistication",
    "Living my best life"
  ]},
];

export default function BioGenerator() {
  const [platform, setPlatform] = useState<"instagram" | "twitter" | "linkedin">("instagram");
  const [niche, setNiche] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [useCount, setUseCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("ai_bio_uses");
    if (stored) {
      setUseCount(parseInt(stored, 10));
    }
  }, []);

  const generateBio = () => {
    if (useCount >= 3) {
      setShowPremium(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const template = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
      const example = template.examples[Math.floor(Math.random() * template.examples.length)];
      setBio(example);
      setLoading(false);
      
      const newCount = useCount + 1;
      setUseCount(newCount);
      localStorage.setItem("ai_bio_uses", newCount.toString());
    }, 1500);
  };

  const copyBio = () => {
    navigator.clipboard.writeText(bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
              <Type className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Unlock AI Bio Generator
            </h1>
            <p className="text-gray-600 mb-8">
              Create compelling bios for any platform with our AI-powered tool.
            </p>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Premium Plan</span>
                <span className="text-3xl font-bold text-gray-900">$4.99<span className="text-lg font-normal text-gray-500">/mo</span></span>
              </div>
              
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited AI bio generations
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All premium tools included
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ad-free experience
                </li>
              </ul>
              
              <Link
                href="/checkout"
                className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Get Premium
                </span>
              </Link>
              
              <p className="text-gray-500 text-sm mt-4">
                You&apos;ve used 3 free generations. Subscribe for unlimited access.
              </p>
            </div>
            
            <button
              onClick={() => setShowPremium(false)}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Continue with free version
            </button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <Navbar />
      <AIUsageTracker toolName="Bio Generator" />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
              <Type className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Bio Generator</h1>
            <p className="text-gray-600">Create compelling bios for social media</p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              <Crown className="w-3 h-3" />
              Premium Feature
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["instagram", "twitter", "linkedin"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`py-3 px-4 rounded-xl font-medium text-sm capitalize transition-all ${
                        platform === p
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What describes you? (optional)
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g., photographer, developer, entrepreneur"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {!bio && (
                <button
                  onClick={generateBio}
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate Bio
                    </span>
                  )}
                </button>
              )}

              {bio && (
                <div className="space-y-4">
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <p className="text-lg text-gray-800 text-center font-medium">{bio}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={copyBio}
                      className="flex-1 py-3 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      {copied ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={generateBio}
                      className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Regenerate
                      </span>
                    </button>
                  </div>
                  
                  <p className="text-center text-xs text-gray-500">
                    {useCount}/3 free uses remaining
                  </p>
                </div>
              )}
            </div>
          </div>

          <RecommendedTools currentPath="/bio-generator" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
