'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';

export function useLiveDashboardUpdates(refetch: () => void) {
  useEffect(() => {
    const socket = getSocket();
    const handler = () => {
      refetch();
    };

    socket.on('inventory_updated', handler);
    socket.on('watchlist_updated', handler);
    socket.on('sale_registered', handler);

    return () => {
      socket.off('inventory_updated', handler);
      socket.off('watchlist_updated', handler);
      socket.off('sale_registered', handler);
    };
  }, [refetch]);
}