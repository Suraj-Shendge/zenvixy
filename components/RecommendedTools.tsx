"use client";

import Link from "next/link";
import { Sparkles, Crown } from "lucide-react";

interface RecommendedToolsProps {
  currentPath?: string;
}

const recommendedTools = [
  { name: "Compress PDF", slug: "/compress-pdf", desc: "Reduce file size" },
  { name: "Remove Background", slug: "/remove-background", desc: "AI-powered" },
  { name: "AI Caption", slug: "/ai-caption", desc: "Generate captions", premium: true },
];

export default function RecommendedTools({ currentPath }: RecommendedToolsProps) {
  return (
    <div className="bg-secondary rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Recommended Tools</h3>
      </div>
      <div className="space-y-3">
        {recommendedTools.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.slug}
            className={`flex items-center justify-between p-3 bg-card rounded-xl hover:bg-card-hover transition-colors group ${
              currentPath === tool.slug ? "ring-2 ring-accent" : ""
            }`}
          >
            <div>
              <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                {tool.name}
              </p>
              <p className="text-xs text-tertiary">{tool.desc}</p>
            </div>
            {tool.premium && (
              <div className="bg-premium/10 text-premium text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                PRO
              </div>
            )}
          </Link>
        ))}
      </div>
      <Link href="/" className="block text-center text-sm text-accent font-medium mt-4 hover:underline">
        View all tools →
      </Link>
    </div>
  );
}
