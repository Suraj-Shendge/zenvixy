"use client";

import { useState, useEffect } from "react";
import { Sparkles, X, Zap } from "lucide-react";
import Link from "next/link";

interface AIUsageTrackerProps {
  toolName: string;
}

export default function AIUsageTracker({ toolName }: AIUsageTrackerProps) {
  const [uses, setUses] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Track AI tool usage
    const stored = localStorage.getItem(`ai_uses_${toolName}`);
    const current = stored ? parseInt(stored, 10) : 0;
    setUses(current);
    
    if (current >= 3 && !dismissed) {
      setShowPrompt(true);
    }
  }, [toolName, dismissed]);

  const incrementUse = () => {
    const newCount = uses + 1;
    setUses(newCount);
    localStorage.setItem(`ai_uses_${toolName}`, newCount.toString());
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl p-5 max-w-sm w-[340px] text-white">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">You&apos;ve used {toolName} {uses} times</h4>
            <p className="text-white/80 text-xs mt-1 leading-relaxed">
              Upgrade to Premium for unlimited AI generations and higher quality output.
            </p>
            
            <div className="flex items-center gap-3 mt-4">
              <Link
                href="/checkout"
                className="inline-flex items-center gap-1.5 bg-white text-indigo-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white/90 transition-colors"
              >
                <Zap className="w-3 h-3" />
                Get Premium
              </Link>
              <Link
                href="/pricing"
                className="text-white/80 hover:text-white text-xs transition-colors"
              >
                Compare plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
