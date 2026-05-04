'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { useToast } from '@/components/ui/toast-provider';

interface WsPayload {
  title?: string;
  profit?: number;
  titleSnapshot?: string;
  name?: string;
  message?: string;
}

export function LiveToasts() {
  const { push } = useToast();

  useEffect(() => {
    const socket = getSocket();

    const onSaleRegistered = (x: WsPayload) => {
      push({
        title: '💰 Новий продаж!',
        message: `${x?.title ?? 'Товар продано'} • Прибуток: +${x?.profit ?? 0}₴`,
      });
    };

    const onInventoryUpdated = (x: WsPayload) => {
      push({
        title: '📦 Інвентар оновлено',
        message: x?.titleSnapshot ?? x?.title ?? 'Дані синхронізовано',
      });
    };

    const onUserCreated = (x: WsPayload) => {
      push({
        title: '👤 Новий користувач',
        message: x?.name ?? 'Оператора додано до системи',
      });
    };

    const onNotification = (x: WsPayload) => {
      push({
        title: x?.title ?? '🔔 Системне сповіщення',
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