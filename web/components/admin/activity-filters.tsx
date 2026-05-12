'use client';

export function ActivityFilters({
  setFilterAction,
}: {
  setFilterAction: (x: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {['all', 'sale', 'inventory', 'user'].map((f) => (
        <button
          key={f}
          onClick={() => setFilterAction(f)}
          className="px-3 py-1 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background)] text-sm transition-colors"
        >
          {f}
        </button>
      ))}
    </div>
  );
}