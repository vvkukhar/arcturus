'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { useToast } from '@/components/ui/toast-provider';

export function LiveToasts() {
  const { push } = useToast();

  useEffect(() => {
    const socket = getSocket();

    socket.on('sale_registered', (x: any) => {
      push({
        title: 'Sale',
        message: `${x.title} • +${x.profit}`,
      });
    });

    socket.on('inventory_updated', (x: any) => {
      push({
        title: 'Inventory updated',
        message: x.titleSnapshot,
      });
    });

    socket.on('user_created', (x: any) => {
      push({
        title: 'New user',
        message: x.name,
      });
    });

    return () => {
      socket.off('sale_registered');
      socket.off('inventory_updated');
      socket.off('user_created');
    };
  }, [push]);

  return null;
}