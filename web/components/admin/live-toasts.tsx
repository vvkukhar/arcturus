'use client';

import { useRef, useCallback } from 'react';
import { useSocketEvent } from '@/lib/use-socket';
import { useToast } from '@/components/ui/toast-provider';

interface WsPayload {
  id?: string;
  title?: string;
  profit?: number;
  titleSnapshot?: string;
  name?: string;
  message?: string;
}

export function LiveToasts() {
  const { push } = useToast();
  const processedEvents = useRef<Set<string>>(new Set());

  const handleEvent = useCallback((id: string, toastData: Parameters<typeof push>[0]) => {
    if (processedEvents.current.has(id)) return;
    processedEvents.current.add(id);
    push(toastData);
    setTimeout(() => processedEvents.current.delete(id), 10000);
  }, [push]);

  useSocketEvent<WsPayload>('sale_registered', (x) => {
    const eventId = x.id || `sale-${Date.now()}`;
    handleEvent(eventId, {
      title: '💰 Новий продаж!',
      message: `${x.title ?? 'Товар продано'} • Прибуток: +${x.profit ?? 0}₴`,
    });
  });

  useSocketEvent<WsPayload>('inventory_updated', (x) => {
    const eventId = x.id || `inv-${Date.now()}`;
    handleEvent(eventId, {
      title: '📦 Інвентар оновлено',
      message: x.titleSnapshot ?? x.title ?? 'Дані синхронізовано',
    });
  });

  useSocketEvent<WsPayload>('user_created', (x) => {
    const eventId = x.id || `usr-${Date.now()}`;
    handleEvent(eventId, {
      title: '👤 Новий користувач',
      message: x.name ?? 'Оператора додано до системи',
    });
  });

  useSocketEvent<WsPayload>('notification', (x) => {
    const eventId = x.id || `notif-${Date.now()}`;
    handleEvent(eventId, {
      title: x.title ?? '🔔 Системне сповіщення',
      message: x.message ?? '',
    });
  });

  return null;
}