import { Card, CardContent } from '@/components/ui/card';

type Props = {
  title: string;
  children: React.ReactNode;
};

export function SectionCard({ title, children }: Props) {
  return (
    <Card>
      <CardContent>
        <div className="mb-4 text-lg font-black">{title}</div>
        {children}
      </CardContent>
    </Card>
  );
}