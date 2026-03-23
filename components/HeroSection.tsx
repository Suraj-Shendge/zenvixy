"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>20+ Free Tools • No Sign-up Required</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground mb-6 animate-slide-up">
            All Your Tools.
            <br />
            <span className="text-gradient">One Clean Space.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-tertiary mb-10 animate-slide-up animate-delay-100">
            Fast. Private. No clutter.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-delay-200">
            <Link 
              href="#pdf-tools" 
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              Start using tools
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/pricing" 
              className="btn-premium inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              <Sparkles className="w-5 h-5" />
              Go Premium
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-tertiary animate-fade-in animate-delay-300">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No sign-up required
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% free to use
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Files processed locally
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
