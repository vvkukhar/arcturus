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
    <Card className={cn('overflow-hidden bg-[var(--card)] border-[var(--border)] transition-all duration-300 hover:shadow-lg hover:border-blue-500/30', className)}>
      <div className="border-b border-[var(--border)] bg-[var(--background)]/50 backdrop-blur-md px-6 py-5">
        <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">{title}</h2>
      </div>
      <CardContent className={cn('p-6', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}