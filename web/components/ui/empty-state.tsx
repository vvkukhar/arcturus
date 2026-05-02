type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-white p-10 text-center">
      <div className="text-xl font-black">{title}</div>
      {description ? (
        <div className="mt-2 text-sm text-slate-500">{description}</div>
      ) : null}
    </div>
  );
}