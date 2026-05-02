type Props = {
  title: string;
  values: number[];
  labels: string[];
};

export function DashboardChartCard({ title, values, labels }: Props) {
  const max = Math.max(...values, 1);

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="text-lg font-black">{title}</div>
      <div className="mt-5 flex h-48 items-end gap-3">
        {values.map((value, index) => (
          <div key={`${labels[index]}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-xl bg-slate-900"
              style={{
                height: `${Math.max((value / max) * 160, 8)}px`,
              }}
            />
            <div className="text-xs text-slate-500">{labels[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}