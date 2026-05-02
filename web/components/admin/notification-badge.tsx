'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

export function NotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data) => {
        const unread = data.filter((x: any) => !x.read).length;
        setCount(unread);
      });

    const socket = getSocket();

    socket.on('notification', () => {
      setCount((x) => x + 1);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  if (count === 0) return null;

  return (
    <div className="absolute -right-1 -top-1 rounded-full bg-red-500 text-white text-xs px-1.5">
      {count}
    </div>
  );
}