import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function SectionCard({ title, children, className, contentClassName }: Props) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="border-b border-border bg-slate-50/50 px-6 py-5">
        <h2 className="text-xl font-black text-slate-900">{title}</h2>
      </div>
      <CardContent className={cn('p-6', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}