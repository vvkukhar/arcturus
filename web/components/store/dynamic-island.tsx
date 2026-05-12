'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

export function DynamicIsland() {
  const { t } = useI18n();
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  const intervalRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    const messages = [
      t('dynamic.msg1' as any),
      t('dynamic.msg2' as any),
      t('dynamic.msg3' as any)
    ];

    let currentIndex = 0;

    const runSequence = () => {
      setMessage(messages[currentIndex]);
      setActive(true);
      
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setActive(false);
      }, 5000);

      currentIndex = (currentIndex + 1) % messages.length;
    };

    intervalRef.current = setInterval(runSequence, 15000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [t]);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div
        className={cn(
          'flex items-center gap-3 bg-black/90 backdrop-blur-xl text-white rounded-full overflow-hidden transition-all duration-700 ease-out-expo shadow-2xl shadow-blue-900/20 border border-white/10',
          active ? 'w-[340px] h-12 px-4 opacity-100 scale-100 translate-y-0' : 'w-24 h-6 px-0 opacity-0 scale-90 -translate-y-4'
        )}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
          <Sparkles size={12} className="text-white" />
        </div>
        <div className="truncate text-xs font-bold tracking-wide">
          {message}
        </div>
      </div>
    </div>
  );
}