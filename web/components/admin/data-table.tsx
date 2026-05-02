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
};

export function DataTable<T>({
  columns,
  rows,
  emptyText = 'No data',
}: Props<T>) {
  if (rows.length === 0) {
    return <div className="text-sm text-slate-500">{emptyText}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`border-b border-border px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500 ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="bg-white">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`border-b border-border px-4 py-4 align-top text-sm text-slate-800 ${column.className ?? ''}`}
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