'use client';

export function ActivityFilters({
  setFilter,
}: {
  setFilter: (x: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {['all', 'sale', 'inventory', 'user'].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className="px-3 py-1 rounded-xl border text-sm"
        >
          {f}
        </button>
      ))}
    </div>
  );
}