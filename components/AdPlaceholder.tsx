export default function AdPlaceholder({ type = "banner" }: { type?: "banner" | "native" | "sticky" }) {
  if (type === "sticky") {
    return (
      <div className="ad-sticky flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ad-shimmer rounded-lg ad-shimmer" />
          <div className="space-y-1">
            <div className="w-24 h-3 bg-ad-shimmer rounded ad-shimmer" />
            <div className="w-16 h-2 bg-ad-shimmer rounded ad-shimmer" />
          </div>
        </div>
        <button className="text-xs font-medium text-accent hover:underline">
          Learn more
        </button>
      </div>
    );
  }

  if (type === "native") {
    return (
      <div className="bg-secondary rounded-2xl p-4 border border-border">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-ad-shimmer rounded-xl ad-shimmer flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-32 h-4 bg-ad-shimmer rounded ad-shimmer" />
            <div className="w-full h-3 bg-ad-shimmer rounded ad-shimmer" />
            <div className="w-3/4 h-3 bg-ad-shimmer rounded ad-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  // Banner
  return (
    <div className="bg-secondary border border-border rounded-xl p-3 text-center">
      <div className="w-full h-12 bg-ad-shimmer rounded ad-shimmer" />
    </div>
  );
}
