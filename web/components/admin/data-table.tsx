import React from 'react';

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
    return (
      <div className="flex items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-400">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`border-b border-border bg-slate-50/80 px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500 ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, index) => (
            <tr
              key={getRowKey ? getRowKey(row, index) : index}
              className="bg-white transition-colors hover:bg-slate-50/80"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-5 py-4 align-top text-sm text-slate-800 ${column.className ?? ''}`}
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