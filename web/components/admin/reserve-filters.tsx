'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = {
  currentStatus: string;
};

export function ReserveFilters({ currentStatus }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setStatus = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }

    router.push(`?${params.toString()}`);
  };

  const statuses = [
    { value: 'all', label: 'All Requests' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const isActive = currentStatus === status.value;
        return (
          <button
            key={status.value}
            onClick={() => setStatus(status.value)}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-bold transition-all border',
              isActive
                ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] shadow-md'
                : 'bg-[var(--card)] text-slate-500 hover:text-[var(--foreground)] hover:bg-[var(--background)] border-[var(--border)]'
            )}
          >
            {status.label}
          </button>
        );
      })}
    </div>
  );
}