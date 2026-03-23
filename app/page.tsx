"use client";

import Link from "next/link";
import { FileArchive, Image, Sparkles, Calculator, Crown, Zap } from "lucide-react";

type Tool = {
  name: string;
  href: string;
  desc: string;
  premium?: boolean;
};

type Category = {
  name: string;
  icon: any;
  tools: Tool[];
};

const categories: Category[] = [
  {
    name: "PDF Tools",
    icon: FileArchive,
    tools: [
      { name: "Compress PDF", href: "/compress-pdf", desc: "Reduce file size" },
      { name: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs" },
      { name: "Split PDF", href: "/split-pdf", desc: "Divide PDFs" },
      { name: "PDF to JPG", href: "/pdf-to-jpg", desc: "Convert to images" },
    ],
  },
  {
    name: "Image Tools",
    icon: Image,
    tools: [
      { name: "Resize Image", href: "/resize-image", desc: "Change dimensions" },
      { name: "Compress Image", href: "/compress-image", desc: "Reduce file size" },
      { name: "Remove Background", href: "/remove-background", desc: "Cut out subject" },
      { name: "PNG to JPG", href: "/png-to-jpg", desc: "Convert format" },
      { name: "Crop Image", href: "/crop-image", desc: "Trim edges" },
    ],
  },
  {
    name: "AI Tools",
    icon: Sparkles,
    tools: [
      { name: "AI Caption", href: "/ai-caption", desc: "Generate captions", premium: true },
      { name: "Bio Generator", href: "/bio-generator", desc: "Create bios", premium: true },
    ],
  },
  {
    name: "Utilities",
    icon: Calculator,
    tools: [
      { name: "Text Cleaner", href: "/text-cleaner", desc: "Format text" },
      { name: "Word Counter", href: "/word-counter", desc: "Count words" },
      { name: "Age Calculator", href: "/age-calculator", desc: "Calculate age" },
      { name: "Percentage Calc", href: "/percentage-calculator", desc: "Find percentages" },
      { name: "Unit Converter", href: "/unit-converter", desc: "Convert units" },
      { name: "QR Generator", href: "/qr-generator", desc: "Create QR codes" },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-black">Zenvixy</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                Pricing
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                <Crown className="w-4 h-4" />
                Go Premium
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
          All Your Tools.
          <br />
          <span className="text-gray-400">One Clean Space.</span>
        </h1>
        
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
          Professional-grade utilities for PDF, images, and text. 
          No watermarks. No sign-ups. Just results.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="#tools"
            className="w-full sm:w-auto px-6 py-3.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Start Using Tools
          </Link>
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 text-black rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="max-w-5xl mx-auto px-6 pb-20">
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  <category.icon className="w-4 h-4 text-gray-600" />
                </div>
                <h2 className="text-lg font-semibold text-black">{category.name}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-gray-700" />
                      </div>
                      {tool.premium && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">
                          PRO
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-black mb-0.5 group-hover:text-gray-600">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-400">{tool.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-gray-50 rounded-3xl p-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-4">
            <Crown className="w-3 h-3 text-gray-500" />
            <span className="text-xs font-medium text-gray-500">Premium</span>
          </div>
          
          <h2 className="text-xl font-semibold text-black mb-2">
            Unlock High Definition Quality
          </h2>
          
          <p className="text-sm text-gray-500 mb-6">
            Free users get standard quality. Premium for HD downloads and no ads.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-3xl font-bold text-black">$4.99<span className="text-sm font-normal text-gray-400">/mo</span></p>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-black">Zenvixy</span>
            </div>
            
            <div className="flex items-center gap-5 text-sm text-gray-400">
              <Link href="/about" className="hover:text-gray-600">About</Link>
              <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
              <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-600">Terms</Link>
            </div>
            
            <p className="text-sm text-gray-400">
              © 2024 Zenvixy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
