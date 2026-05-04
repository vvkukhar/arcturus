'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FomoEvent {
  title: string;
  time: string;
}

interface SalePayload {
  title?: string;
  [key: string]: unknown;
}

export function FomoTicker() {
  const [event, setEvent] = useState<FomoEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    let timeoutId: NodeJS.Timeout;

    const onSale = (payload: SalePayload) => {
      setEvent({ 
        title: payload?.title || 'Ексклюзивний набір', 
        time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) 
      });
      setVisible(true);
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setVisible(false);
      }, 6000);
    };

    socket.on('sale_registered', onSale);
    
    return () => { 
      socket.off('sale_registered', onSale); 
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={cn(
      "fixed bottom-6 left-6 z-[100] transition-all duration-700 ease-out-expo",
      visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"
    )}>
      <div className="flex items-center gap-4 rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/60 p-4 shadow-2xl shadow-blue-900/10 pr-8">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-inner">
          <PackageCheck size={24} className="text-white" />
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Щойно придбано</div>
          <div className="text-sm font-black text-slate-900 line-clamp-1 max-w-[200px]">{event?.title}</div>
        </div>
        <div className="ml-2 text-xs font-bold text-slate-400">{event?.time}</div>
      </div>
    </div>
  );
}