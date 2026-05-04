'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
  'Щойно зарезервовано: LEGO Star Wars 75192',
  'Нове надходження у каталозі',
  'Оформлено покупку: LEGO Ninjago City Gardens'
];

export function DynamicIsland() {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const runSequence = () => {
      setMessage(MESSAGES[currentIndex]);
      setActive(true);
      
      timeoutId = setTimeout(() => {
        setActive(false);
      }, 5000);

      currentIndex = (currentIndex + 1) % MESSAGES.length;
    };

    const intervalId = setInterval(runSequence, 15000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

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