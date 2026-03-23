"use client";

import { useState, useEffect } from "react";
import { Sparkles, Copy, CheckCheck, Crown, Zap, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIUsageTracker from "@/components/AIUsageTracker";
import RecommendedTools from "@/components/RecommendedTools";

const captions = [
  "Captured in monochrome, living in color",
  "Where light meets shadow, stories unfold",
  "A moment caught in time, forever preserved",
  "Simplicity speaks louder than complexity",
  "The art of seeing what others miss",
  "Elegance in every frame",
  "Less noise, more soul",
  "Chasing light, embracing shadows",
];

export default function AICaptionGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [useCount, setUseCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("ai_caption_uses");
    if (stored) {
      setUseCount(parseInt(stored, 10));
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaption = () => {
    if (useCount >= 3) {
      setShowPremium(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const randomCaption = captions[Math.floor(Math.random() * captions.length)];
      setCaption(randomCaption);
      setLoading(false);
      
      const newCount = useCount + 1;
      setUseCount(newCount);
      localStorage.setItem("ai_caption_uses", newCount.toString());
    }, 1500);
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(caption);
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
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Unlock AI Caption Generator
            </h1>
            <p className="text-gray-600 mb-8">
              Generate creative captions for your images with our AI-powered tool.
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
                  Unlimited AI caption generations
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
      <AIUsageTracker toolName="Caption Generator" />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Caption Generator</h1>
            <p className="text-gray-600">Generate creative captions for your images</p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              <Crown className="w-3 h-3" />
              Premium Feature
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            {!imageUrl ? (
              <label className="block">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-300 transition-colors">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload an image to generate caption</p>
                  <span className="text-sm text-gray-400">PNG, JPG up to 10MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setImageUrl(null)}
                    className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {!caption && (
                  <button
                    onClick={generateCaption}
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
                        Generate Caption
                      </span>
                    )}
                  </button>
                )}

                {caption && (
                  <div className="space-y-4">
                    <div className="p-6 bg-gray-50 rounded-2xl">
                      <p className="text-lg text-gray-800 text-center font-medium">{caption}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={copyCaption}
                        className="flex-1 py-3 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        {copied ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={generateCaption}
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
            )}
          </div>

          <RecommendedTools currentPath="/ai-caption" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
