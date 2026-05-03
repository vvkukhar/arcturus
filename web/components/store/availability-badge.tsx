import { cn } from '@/lib/utils';

type Props = {
  quantity?: number | null;
};

export function AvailabilityBadge({ quantity }: Props) {
  const available = (quantity ?? 0) > 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-sm',
        available
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
          : 'bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-400/20'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          available ? 'bg-emerald-500' : 'bg-slate-400'
        )}
      />
      {available ? 'Available Now' : 'Out of Stock'}
    </span>
  );
}