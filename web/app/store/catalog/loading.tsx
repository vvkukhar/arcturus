export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="h-4 w-24 rounded-full bg-[var(--background)] animate-pulse" />
        <div className="mt-4 h-10 w-64 rounded-full bg-[var(--background)] animate-pulse" />
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="h-12 flex-1 rounded-2xl bg-[var(--background)] animate-pulse" />
          <div className="h-12 w-full sm:w-32 rounded-2xl bg-[var(--background)] animate-pulse" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm h-[420px]">
            <div className="w-full flex-1 rounded-[2rem] bg-[var(--background)] animate-pulse" />
            <div className="p-3 space-y-3">
              <div className="h-6 w-3/4 rounded-full bg-[var(--background)] animate-pulse" />
              <div className="h-4 w-1/2 rounded-full bg-[var(--background)] animate-pulse" />
              <div className="h-8 w-1/3 rounded-full bg-[var(--background)] animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}