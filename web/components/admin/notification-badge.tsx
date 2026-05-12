'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { getSocket } from '@/lib/socket';
import { swrFetcher } from '@/lib/swr-fetcher';

interface NotificationRow {
  id: string;
  read: boolean;
}

export function NotificationBadge() {
  const { data, mutate } = useSWR<NotificationRow[]>('/api/notifications', swrFetcher, {
    fallbackData: [],
  });

  const count = Array.isArray(data) ? data.filter((x) => !x.read).length : 0;

  useEffect(() => {
    const socket = getSocket();
    const onNotification = () => {
      mutate();
    };

    socket.on('notification', onNotification);

    return () => {
      socket.off('notification', onNotification);
    };
  }, [mutate]);

  if (count === 0) return null;

  return (
    <div className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white shadow-sm ring-2 ring-[var(--card)]">
      {count > 99 ? '99+' : count}
    </div>
  );
}