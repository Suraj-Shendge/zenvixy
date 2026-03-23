"use client";

import { useState } from "react";
import { Sparkles, X, ChevronRight, Crown } from "lucide-react";
import Link from "next/link";

interface UpgradePromptProps {
  type?: "quality" | "ai" | "storage" | "general";
  message?: string;
}

export default function UpgradePrompt({ type = "general", message }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const [dismissedForever, setDismissedForever] = useState(false);

  if (dismissedForever) return null;

  const getContent = () => {
    switch (type) {
      case "quality":
        return {
          title: "Need higher quality?",
          description: "Unlock high quality output and remove ads with Premium.",
          cta: "Learn More",
          show: true,
        };
      case "ai":
        return {
          title: "Unlock AI Tools",
          description: "Generate creative captions and professional bios with our AI-powered tools.",
          cta: "Try AI Tools",
          show: true,
        };
      case "storage":
        return {
          title: "Save to cloud",
          description: "Store your processed files securely with Premium cloud storage.",
          cta: "Get Started",
          show: true,
        };
      default:
        return {
          title: "Upgrade your experience",
          description: "Get high quality output, AI tools, and an ad-free experience.",
          cta: "See Benefits",
          show: true,
        };
    }
  };

  const content = getContent();

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 max-w-sm w-[340px]">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm">{content.title}</h4>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">{content.description}</p>
            
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 mt-3 text-indigo-600 hover:text-indigo-700 text-xs font-medium transition-colors"
            >
              {content.cta}
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        
        <button
          onClick={() => setDismissedForever(true)}
          className="w-full mt-4 pt-3 border-t border-gray-100 text-gray-400 hover:text-gray-600 text-xs transition-colors"
        >
          Dismiss forever
        </button>
      </div>
    </div>
  );
}
