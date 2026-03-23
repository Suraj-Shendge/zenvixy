"use client";

export default function LoadingSpinner({ message = "Processing..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-3 bg-accent/10 rounded-full animate-pulse" />
      </div>
      <p className="text-lg font-medium text-foreground mb-1">{message}</p>
      <p className="text-sm text-tertiary">This will only take a moment</p>
    </div>
  );
}
