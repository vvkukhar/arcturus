import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = {
  value: string;
};

export function StatusPill({ value }: Props) {
  const normalized = value.toLowerCase();
  
  const statusConfig: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    queued: 'bg-amber-100 text-amber-800 border-amber-200',
    bought: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    listed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    reviewed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    stale: 'bg-slate-200 text-slate-800 border-slate-300',
    inactive: 'bg-slate-200 text-slate-800 border-slate-300',
    contacted: 'bg-blue-100 text-blue-800 border-blue-200',
    running: 'bg-blue-100 text-blue-800 border-blue-200',
    active: 'bg-blue-100 text-blue-800 border-blue-200',
    buy_now: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    sell: 'bg-blue-100 text-blue-800 border-blue-200',
    hold: 'bg-slate-200 text-slate-800 border-slate-300',
    reprice: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    review: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const className = Object.entries(statusConfig).find(([key]) => normalized.includes(key))?.[1] 
    || 'bg-slate-100 text-slate-700 border-slate-200';

  return <Badge className={cn('px-2.5 py-1', className)}>{value}</Badge>;
}