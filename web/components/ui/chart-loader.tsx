import { Loader2 } from 'lucide-react';

export function ChartLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] border-dashed">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rendering Chart...</span>
      </div>
    </div>
  );
}