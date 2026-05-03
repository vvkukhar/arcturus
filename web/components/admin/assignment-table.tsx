'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

export function AssignmentTable() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    apiFetch<any>('/api/collaboration/assignments')
      .then((resData) => {
        if (mounted) setData(resData);
      })
      .catch(() => {
        if (mounted) setData({ inventory: [], watchlist: [] });
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!data) return null;

  return (
    <div className="rounded-2xl border p-5 bg-white">
      <div className="text-xl font-black">Assignments Table</div>

      <div className="mt-4 space-y-3">
        {data.inventory?.map((x: any) => (
          <div key={x.id} className="border p-3 rounded-xl">
            <div className="font-bold">{x.titleSnapshot}</div>
            <div className="text-sm text-slate-500">
              Assigned: {x.assignedUser?.name ?? 'Unknown'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}