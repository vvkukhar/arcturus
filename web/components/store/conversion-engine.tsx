'use client';

import { useEffect, useState, useRef } from 'react';
import { Flame, Users } from 'lucide-react';
import { getSocket } from '@/lib/socket';

export function ConversionEngine({ itemId }: { itemId: string }) {
  const [mounted, setMounted] = useState(false);
  const [viewers, setViewers] = useState<number>(0);
  const [recentSales, setRecentSales] = useState(0);
  const isMounted = useRef(false);
  const jitterInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    setViewers(Math.floor(Math.random() * 3) + 2);
    isMounted.current = true;
    
    const socket = getSocket();
    socket.emit('join_item_room', itemId);
    
    const handleViewersUpdate = (count: number) => {
      if (isMounted.current) {
        setViewers(count > 0 ? count : Math.floor(Math.random() * 3) + 2);
      }
    };

    const handleSale = (payload: { itemId: string }) => {
      if (isMounted.current && payload.itemId === itemId) {
        setRecentSales((prev) => prev + 1);
      }
    };

    socket.on('viewers_update', handleViewersUpdate);
    socket.on('sale_registered', handleSale);

    jitterInterval.current = setInterval(() => {
      if (isMounted.current) {
        setViewers((prev) => Math.max(2, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
    }, 12000);

    return () => {
      isMounted.current = false;
      clearInterval(jitterInterval.current);
      socket.off('viewers_update', handleViewersUpdate);
      socket.off('sale_registered', handleSale);
      socket.emit('leave_item_room', itemId);
    };
  }, [itemId]);

  if (!mounted) return <div className="h-[46px] my-6" />;

  return (
    <div className="flex flex-col gap-3 my-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3.5 py-2.5 rounded-xl w-fit border border-orange-200 dark:border-orange-800/50 shadow-sm">
        <Users size={16} className="animate-pulse" />
        {viewers} collectors viewing right now
      </div>
      
      {recentSales > 0 && (
        <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3.5 py-2.5 rounded-xl w-fit border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
          <Flame size={16} className="animate-bounce" />
          {recentSales} sold in the last 24 hours
        </div>
      )}
    </div>
  );
}