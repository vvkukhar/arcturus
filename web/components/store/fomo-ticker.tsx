'use client';

import { useEffect, useState, useRef } from 'react';
import { useSocketEvent } from '@/lib/use-socket';
import { PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';

interface FomoEvent {
  id: string;
  title: string;
  time: string;
}

export function FomoTicker() {
  const { t } = useI18n();
  const [activeEvent, setActiveEvent] = useState<FomoEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const queue = useRef<FomoEvent[]>([]);
  const isProcessing = useRef(false);

  useSocketEvent<{ id?: string; title?: string; titleSnapshot?: string }>('sale_registered', (payload) => {
    queue.current.push({
      id: payload.id || Date.now().toString(),
      title: payload.title || payload.titleSnapshot || (t('fomo.exclusive' as any) as string),
      time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
    });
    processQueue();
  });

  const processQueue = () => {
    if (isProcessing.current || queue.current.length === 0) return;
    
    isProcessing.current = true;
    const nextEvent = queue.current.shift()!;
    
    setActiveEvent(nextEvent);
    requestAnimationFrame(() => setVisible(true));

    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveEvent(null);
        isProcessing.current = false;
        if (queue.current.length > 0) processQueue();
      }, 600);
    }, 4500);
  };

  return (
    <div className={cn(
      "fixed bottom-6 left-6 z-[100] transition-all duration-500 ease-out-expo transform-gpu will-change-transform",
      visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95 pointer-events-none"
    )}>
      <div className="flex items-center gap-4 rounded-[1.5rem] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 p-3 shadow-2xl shadow-blue-900/10 pr-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-emerald-400 to-teal-500 shadow-inner">
          <PackageCheck size={22} className="text-white" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-0.5">
            {t('fomo.justBought' as any) as string}
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 max-w-[220px]">
            {activeEvent?.title}
          </div>
        </div>
        <div className="ml-3 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 shrink-0">
          {activeEvent?.time}
        </div>
      </div>
    </div>
  );
}