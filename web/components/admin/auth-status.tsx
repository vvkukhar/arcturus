'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import type { User } from '@/lib/types';
import { UserCircle } from 'lucide-react';
import { StatusPill } from '@/components/admin/status-pill';

export function AuthStatus() {
  const { data: user, isLoading } = useSWR<User>('/api/auth/me', swrFetcher as any);

  return (
    <div className="flex items-center gap-4 rounded-[1.5rem] border border-border bg-white px-5 py-3 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <UserCircle className="h-7 w-7" />
      </div>
      {user ? (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 leading-tight">{user.name}</span>
          <div className="mt-1">
            <StatusPill value={user.role} />
          </div>
        </div>
      ) : isLoading ? (
        <div className="text-sm font-medium text-slate-400">Loading session...</div>
      ) : (
        <div className="text-sm font-medium text-red-500">Session error</div>
      )}
    </div>
  );
}