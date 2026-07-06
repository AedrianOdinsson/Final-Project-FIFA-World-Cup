export function SkeletonRow({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#1a1a1a] border border-gray-800 ${className}`}
    />
  );
}

export function SkeletonList({ count = 6, rowClassName = "h-16" }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} className={rowClassName} />
      ))}
    </div>
  );
}