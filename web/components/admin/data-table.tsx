type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyText?: string;
  getRowKey?: (row: T, index: number) => string;
};

export function DataTable<T>({
  columns,
  rows,
  emptyText = 'No data',
  getRowKey,
}: Props<T>) {
  if (rows.length === 0) {
    return <div className="text-sm text-slate-500">{emptyText}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500 ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={getRowKey ? getRowKey(row, index) : index}
              className="bg-white hover:bg-slate-50"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`border-b border-border px-4 py-4 align-top text-sm text-slate-800 last:border-b-0 ${column.className ?? ''}`}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}