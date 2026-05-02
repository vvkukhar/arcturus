import { Card, CardContent } from '@/components/ui/card';

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export function MetricCard({ title, value, subtitle }: Props) {
  return (
    <Card>
      <CardContent>
        <div className="text-sm font-semibold text-slate-500">{title}</div>
        <div className="mt-2 text-3xl font-black tracking-tight">{value}</div>
        {subtitle ? (
          <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}