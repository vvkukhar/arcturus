'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { useToast } from '@/components/ui/toast-provider';

export function LiveToasts() {
  const { push } = useToast();

  useEffect(() => {
    const socket = getSocket();

    const onSaleRegistered = (x: any) => {
      push({
        title: 'Sale',
        message: `${x?.title ?? 'Sale registered'} • +${x?.profit ?? 0}`,
      });
    };

    const onInventoryUpdated = (x: any) => {
      push({
        title: 'Inventory updated',
        message: x?.titleSnapshot ?? x?.title ?? 'Inventory changed',
      });
    };

    const onUserCreated = (x: any) => {
      push({
        title: 'New user',
        message: x?.name ?? 'User created',
      });
    };

    const onNotification = (x: any) => {
      push({
        title: x?.title ?? 'Notification',
        message: x?.message ?? '',
      });
    };

    socket.on('sale_registered', onSaleRegistered);
    socket.on('inventory_updated', onInventoryUpdated);
    socket.on('user_created', onUserCreated);
    socket.on('notification', onNotification);

    return () => {
      socket.off('sale_registered', onSaleRegistered);
      socket.off('inventory_updated', onInventoryUpdated);
      socket.off('user_created', onUserCreated);
      socket.off('notification', onNotification);
    };
  }, [push]);

  return null;
}