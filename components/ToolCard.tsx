"use client";

import Link from "next/link";
import { LucideIcon, Crown } from "lucide-react";

interface ToolCardProps {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
  premium?: boolean;
}

export default function ToolCard({ name, href, icon: Icon, description, premium = false }: ToolCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5 text-white" />
          </div>
          {premium && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-semibold uppercase tracking-wide">
              Pro
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
