'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

export function CollaborationPanel() {
  const [assignments, setAssignments] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    apiFetch<any>('/api/collaboration/assignments')
      .then((data) => {
        if (mounted) setAssignments(data);
      })
      .catch(() => {
        if (mounted) setAssignments({ inventory: [], watchlist: [] });
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Collaboration</div>
      {!assignments ? (
        <div className="text-sm text-slate-500">Loading...</div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-500">
            Inventory Assignments: {assignments.inventory?.length ?? 0}
          </div>
          <div className="text-sm font-semibold text-slate-500">
            Watchlist Assignments: {assignments.watchlist?.length ?? 0}
          </div>
        </div>
      )}
    </div>
  );
}