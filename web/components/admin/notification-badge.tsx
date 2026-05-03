'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

export function NotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await fetch('/api/notifications', {
          cache: 'no-store',
        });

        if (!response.ok) return;

        const data = await response.json();
        const rows = Array.isArray(data) ? data : [];
        const unread = rows.filter((x: any) => !x.read).length;

        if (mounted) {
          setCount(unread);
        }
      } catch {
        // keep current count
      }
    };

    const socket = getSocket();

    const onNotification = () => {
      setCount((x) => x + 1);
    };

    load();
    socket.on('notification', onNotification);

    return () => {
      mounted = false;
      socket.off('notification', onNotification);
    };
  }, []);

  if (count === 0) return null;

  return (
    <div className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
      {count}
    </div>
  );
}