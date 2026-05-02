'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function ReserveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('status') ?? 'all';

  const setStatus = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }

    router.push(`/admin/reserves?${params.toString()}`);
  };

  const statuses = ['all', 'pending', 'approved', 'rejected', 'contacted'];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => setStatus(status)}
          className={`rounded-full border px-3 py-2 text-sm ${
            current === status ? 'bg-slate-900 text-white' : 'bg-white'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}