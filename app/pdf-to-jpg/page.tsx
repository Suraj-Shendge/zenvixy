"use client";

import { Crown, Lock, FileImage } from "lucide-react";
import RecommendedTools from "@/components/RecommendedTools";
import Link from "next/link";

export default function PDFToJPG() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <Link href="/" className="text-sm text-tertiary hover:text-foreground mb-4 inline-block">← Back to tools</Link>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                  <FileImage className="w-7 h-7 text-purple-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-foreground">PDF to JPG</h1>
                  <p className="text-tertiary">Convert PDF pages to high-quality images</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-premium/5 to-accent/5 border border-premium/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-premium/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-premium" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Premium Feature</h2>
              <p className="text-tertiary mb-6">Get unlimited access to all tools with no ads.</p>
              <Link href="/pricing" className="btn-premium inline-flex items-center gap-2">
                <Crown className="w-5 h-5" />Go Premium — ₹149/mo
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <RecommendedTools />
          </div>
        </div>
      </div>
    </div>
  );
}
