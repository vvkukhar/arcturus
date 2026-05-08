import { Card, CardContent } from '@/components/ui/card';

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export function MetricCard({ title, value, subtitle }: Props) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-800 group bg-[var(--card)] border-[var(--border)]">
      <CardContent className="p-6">
        <div className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-500 transition-colors">
          {title}
        </div>
        <div className="mt-3 text-4xl font-black tracking-tighter text-[var(--foreground)]">
          {value}
        </div>
        {subtitle && (
          <div className="mt-2 text-xs font-bold text-slate-400">
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  );
}