export default function Loading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-2xl bg-slate-100"
        />
      ))}
    </div>
  );
}