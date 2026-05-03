import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold tracking-wide text-slate-700 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}