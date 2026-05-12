'use client';

import { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';

interface FomoEvent {
  title: string;
  time: string;
  id: number;
}

export function FomoTicker() {
  const { t } = useI18n();
  const [eventQueue, setEventQueue] = useState<FomoEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<FomoEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    const socket = getSocket();

    const onSale = (payload: { title?: string }) => {
      const newEvent = {
        title: payload?.title || (t('fomo.exclusive' as any) as string),
        time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        id: Date.now()
      };
      setEventQueue((prev) => [...prev, newEvent]);
    };

    socket.on('sale_registered', onSale);
    return () => { socket.off('sale_registered', onSale); };
  }, [t]);

  useEffect(() => {
    if (eventQueue.length > 0 && !isProcessing.current) {
      isProcessing.current = true;
      const nextEvent = eventQueue[0];
      
      setActiveEvent(nextEvent);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setEventQueue((prev) => prev.slice(1));
          isProcessing.current = false;
        }, 700);
      }, 5000);
    }
  }, [eventQueue]);

  return (
    <div className={cn(
      "fixed bottom-6 left-6 z-[100] transition-all duration-700 ease-out-expo",
      visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"
    )}>
      <div className="flex items-center gap-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xl shadow-blue-900/10 pr-8">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-inner">
          <PackageCheck size={24} className="text-white" />
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
            {t('fomo.justBought' as any) as string}
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 max-w-[200px]">{activeEvent?.title}</div>
        </div>
        <div className="ml-2 text-xs font-bold text-slate-400">{activeEvent?.time}</div>
      </div>
    </div>
  );
}