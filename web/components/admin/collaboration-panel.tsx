'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2 } from 'lucide-react';

interface AssignmentsSummary {
  inventory: any[];
  watchlist: any[];
}

export function CollaborationPanel() {
  const [assignments, setAssignments] = useState<AssignmentsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiFetch<AssignmentsSummary>('/api/collaboration/assignments')
      .then((data) => {
        if (mounted) setAssignments(data);
      })
      .catch(() => {
        if (mounted) setAssignments({ inventory: [], watchlist: [] });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-[var(--foreground)]">Collaboration Status</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Overview of active task assignments.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 p-4 text-center">
            <div className="text-3xl font-black text-[var(--foreground)]">{assignments?.inventory?.length ?? 0}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Tasks</div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 p-4 text-center">
            <div className="text-3xl font-black text-[var(--foreground)]">{assignments?.watchlist?.length ?? 0}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Watchlist Tasks</div>
          </div>
        </div>
      )}
    </div>
  );
}