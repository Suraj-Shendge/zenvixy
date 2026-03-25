"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <Image src="/logo.png" alt="Zenvixy" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold text-gray-900">Zenvixy</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all"
              >
                <span>✨</span>
                Go Premium
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-8">
            <span className="text-sm font-medium text-gray-600">
              ⚡ Fast. Private. No clutter.
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            All Your Tools.
            <br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              One Clean Space.
            </span>
          </h1>
          
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Professional-grade utilities for PDF, images, and text. 
            No watermarks. No sign-ups. Just results.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#tools"
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              Start Using Tools
              <span>→</span>
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>✨</span>
              Go Premium — $4.99/mo
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* PDF Tools */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-lg">
                📄
              </div>
              <h2 className="text-xl font-bold text-gray-900">PDF Tools</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Compress PDF", href: "/compress-pdf", desc: "Reduce file size" },
                { name: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs" },
                { name: "Split PDF", href: "/split-pdf", desc: "Divide PDFs" },
                { name: "PDF to JPG", href: "/pdf-to-jpg", desc: "Convert to images" },
              ].map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-500">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Image Tools */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg">
                🖼️
              </div>
              <h2 className="text-xl font-bold text-gray-900">Image Tools</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Resize Image", href: "/resize-image", desc: "Change dimensions" },
                { name: "Compress Image", href: "/compress-image", desc: "Reduce file size" },
                { name: "Remove Background", href: "/remove-background", desc: "Cut out subject" },
                { name: "Crop Image", href: "/crop-image", desc: "Trim edges" },
                { name: "Rotate & Flip", href: "/rotate-flip", desc: "Rotate or flip" },
                { name: "PNG to JPG", href: "/png-to-jpg", desc: "Convert format" },
              ].map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-500">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Utilities */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-lg">
                🔧
              </div>
              <h2 className="text-xl font-bold text-gray-900">Utilities</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "QR Generator", href: "/qr-generator", desc: "Create QR codes" },
                { name: "Word Counter", href: "/word-counter", desc: "Count words" },
                { name: "Text Cleaner", href: "/text-cleaner", desc: "Format text" },
                { name: "Age Calculator", href: "/age-calculator", desc: "Calculate age" },
                { name: "Percentage Calc", href: "/percentage-calculator", desc: "Find percentages" },
                { name: "Unit Converter", href: "/unit-converter", desc: "Convert units" },
              ].map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-500">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Unlock High Definition Quality
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Free users get standard quality. Upgrade to Premium for high definition downloads and no ads.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="text-left">
              <p className="text-sm text-gray-500 mb-1">Starting at</p>
              <p className="text-4xl font-bold text-white">$4.99<span className="text-lg text-gray-500">/mo</span></p>
            </div>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
            >
              View Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "100% Private",
              desc: "All processing happens in your browser. Your files never leave your device.",
              icon: "🔒",
            },
            {
              title: "No Watermarks",
              desc: "Free and premium outputs are identical. No watermarks, ever.",
              icon: "✨",
            },
            {
              title: "Instant Results",
              desc: "Watch an ad for HD quality, or get it immediately with Premium.",
              icon: "⚡",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 relative">
                <Image src="/logo.png" alt="Zenvixy" fill className="object-contain" />
              </div>
              <span className="font-semibold text-gray-900">Zenvixy</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
              <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            </div>
            
            <p className="text-sm text-gray-400">
              © 2024 Zenvixy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
