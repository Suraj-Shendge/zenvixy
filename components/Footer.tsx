"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
              <span className="text-white text-xs font-bold">Z</span>
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
  );
}
