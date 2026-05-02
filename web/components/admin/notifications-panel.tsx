'use client';

import { useEffect, useState } from 'react';

export function NotificationsPanel() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then(setRows);
  }, []);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Notifications</div>
      {rows.length === 0 ? (
        <div className="text-sm text-slate-500">No notifications</div>
      ) : (
        rows.slice(0, 10).map((row) => (
          <div key={row.id} className="rounded-xl border border-border p-3">
            <div className="font-bold">{row.title}</div>
            <div className="mt-1 text-sm text-slate-500">{row.message}</div>
            <div className="mt-1 text-xs text-slate-400">{row.type}</div>
          </div>
        ))
      )}
    </div>
  );
}