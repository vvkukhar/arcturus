import { PackageSearch } from 'lucide-react';

type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[var(--border)] bg-[var(--card)]/50 p-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-6">
        <PackageSearch size={32} />
      </div>
      <div className="text-2xl font-black text-[var(--foreground)]">{title}</div>
      {description ? (
        <div className="mt-2 text-base font-medium text-slate-500 max-w-sm">{description}</div>
      ) : null}
    </div>
  );
}