import { Card, CardContent } from '@/components/ui/card';

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export function MetricCard({ title, value, subtitle }: Props) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md hover:border-blue-200 group">
      <CardContent className="p-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition-colors">
          {title}
        </div>
        <div className="mt-3 text-4xl font-black tracking-tighter text-slate-900">
          {value}
        </div>
        {subtitle && (
          <div className="mt-2 text-xs font-medium text-slate-400">
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  );
}