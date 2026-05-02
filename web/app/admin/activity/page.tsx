'use client';

import { useEffect, useState } from 'react';
import { ActivityFilters } from '@/components/admin/activity-filters';

export default function ActivityPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/activity')
      .then((r) => r.json())
      .then(setRows);
  }, []);

  const filtered =
    filter === 'all' ? rows : rows.filter((x) => x.action.includes(filter));

  return (
    <div className="space-y-4">
      <div className="text-2xl font-black">Activity</div>
      <ActivityFilters setFilter={setFilter} />
      {filtered.map((row) => (
        <div key={row.id} className="border p-3 rounded-xl">
          <div className="font-bold">{row.action}</div>
          <div className="text-xs text-slate-500">{row.createdAt}</div>
        </div>
      ))}
    </div>
  );
}