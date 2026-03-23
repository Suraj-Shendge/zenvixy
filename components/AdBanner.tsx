"use client";

// Passive Advertisement Banner Component
// Non-intrusive sponsored content / tool recommendations
// These appear for free users and are clearly marked as sponsored

import { useState } from "react";
import { Sparkles, X, ChevronRight } from "lucide-react";
import Link from "next/link";

interface AdBannerProps {
  variant?: "inline" | "sidebar" | "tool-end";
  className?: string;
}

// Sample sponsored content - in production, this would come from an ad network
// or sponsored tool partnerships
const sponsoredContent = [
  {
    id: 1,
    title: "Notion Templates",
    description: "Boost your productivity with premium templates",
    icon: "📝",
    cta: "Browse",
    url: "/resources/notion-templates",
    badge: "Partner"
  },
  {
    id: 2,
    title: "Canva Pro Trial",
    description: "Design anything with 30+ premium features",
    icon: "🎨",
    cta: "Try Free",
    url: "/resources/canva",
    badge: "Sponsored"
  },
  {
    id: 3,
    title: "Grammarly Premium",
    description: "Write mistake-free in seconds",
    icon: "✍️",
    cta: "Get Deal",
    url: "/resources/grammarly",
    badge: "Partner"
  },
  {
    id: 4,
    title: "Stock Photos Bundle",
    description: "10,000+ royalty-free images",
    icon: "📸",
    cta: "Download",
    url: "/resources/stock-photos",
    badge: "Sponsored"
  }
];

function getRandomAd() {
  return sponsoredContent[Math.floor(Math.random() * sponsoredContent.length)];
}

export default function AdBanner({ variant = "inline", className = "" }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [dismissedForSession, setDismissedForSession] = useState(false);
  
  if (dismissed || dismissedForSession) return null;
  
  const ad = getRandomAd();

  if (variant === "inline") {
    return (
      <div className={`bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
            {ad.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {ad.badge}
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">{ad.title}</h4>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ad.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={ad.url}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              {ad.cta}
              <ChevronRight className="w-3 h-3" />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "tool-end") {
    return (
      <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            You might also like
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center text-lg">
            {ad.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm">{ad.title}</h4>
            <p className="text-xs text-gray-500">{ad.description}</p>
          </div>
          <Link
            href={ad.url}
            className="px-4 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            {ad.cta}
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Sponsored
          </span>
          <button
            onClick={() => setDismissedForSession(true)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm">
            {ad.icon}
          </div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">{ad.title}</h4>
          <p className="text-xs text-gray-500 mb-3">{ad.description}</p>
          <Link
            href={ad.url}
            className="block w-full py-2 text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 rounded-lg transition-colors shadow-sm"
          >
            {ad.cta} →
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
