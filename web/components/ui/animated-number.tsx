'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  value: string | number;
  className?: string;
}

export function AnimatedNumber({ value, className }: Props) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      const prevNum = typeof prevValue.current === 'number' ? prevValue.current : parseFloat(String(prevValue.current).replace(/[^0-9.-]+/g, ""));
      const currNum = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ""));

      if (currNum > prevNum) setFlash('up');
      else if (currNum < prevNum) setFlash('down');

      prevValue.current = value;

      const timer = setTimeout(() => setFlash(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={cn(
        'transition-colors duration-500 ease-out',
        flash === 'up' ? 'text-emerald-500 [text-shadow:0_0_10px_rgba(16,185,129,0.5)]' : 
        flash === 'down' ? 'text-rose-500 [text-shadow:0_0_10px_rgba(225,29,72,0.5)]' : '',
        className
      )}
    >
      {value}
    </span>
  );
}