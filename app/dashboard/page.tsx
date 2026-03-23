"use client";

import { useState } from "react";
import Link from "next/link";
import { FileArchive, Image, Sparkles, Zap, Clock, TrendingUp, Crown } from "lucide-react";

const recentTools = [
  { name: "Compress PDF", icon: FileArchive, slug: "/compress-pdf", uses: 12, lastUsed: "2 hours ago" },
  { name: "Resize Image", icon: Image, slug: "/resize-image", uses: 8, lastUsed: "Yesterday" },
  { name: "AI Caption", icon: Sparkles, slug: "/ai-caption", uses: 5, lastUsed: "3 days ago" },
];

const stats = [
  { label: "Total Operations", value: "47", icon: Zap, color: "#007AFF" },
  { label: "Files Processed", value: "23", icon: FileArchive, color: "#34C759" },
  { label: "This Month", value: "12", icon: TrendingUp, color: "#AF52DE" },
  { label: "Premium Member", value: "No", icon: Crown, color: "#FF9500" },
];

export default function Dashboard() {
  const [isLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-4">Welcome to Dashboard</h1>
          <p className="text-tertiary mb-8">Sign in to track your usage and access saved files.</p>
          <Link href="/login" className="btn-primary inline-flex items-center gap-2">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
          <p className="text-tertiary">Track your tool usage and manage your account</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-sm text-tertiary">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Tools */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Tools</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {recentTools.map((tool, i) => (
              <Link key={i} href={tool.slug} className="bg-card rounded-2xl p-6 border border-border card-hover">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <tool.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tool.name}</p>
                    <p className="text-xs text-tertiary flex items-center gap-1">
                      <Clock className="w-3 h-3" />{tool.lastUsed}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-tertiary">{tool.uses} uses</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {["Compress PDF", "Resize Image", "Remove BG", "AI Caption"].map((name, i) => (
              <Link key={i} href={`/${name.toLowerCase().replace(" ", "-")}`} className="btn-secondary text-center">
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
