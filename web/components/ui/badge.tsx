import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-[var(--foreground)] shadow-sm',
        className,
      )}
      {...props}
    />
  );
}