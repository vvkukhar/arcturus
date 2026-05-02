import { Badge } from '@/components/ui/badge';

type Props = {
  value: string;
};

export function StatusPill({ value }: Props) {
  const normalized = value.toLowerCase();
  let className = '';

  if (normalized.includes('pending')) {
    className = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (
    normalized.includes('bought') ||
    normalized.includes('listed') ||
    normalized.includes('reviewed') ||
    normalized.includes('success')
  ) {
    className = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (
    normalized.includes('failed') ||
    normalized.includes('error') ||
    normalized.includes('stale')
  ) {
    className = 'bg-red-50 text-red-700 border-red-200';
  } else {
    className = 'bg-slate-50 text-slate-700 border-slate-200';
  }

  return <Badge className={className}>{value}</Badge>;
}