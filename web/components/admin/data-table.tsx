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
      <div className="flex items-center justify-center p-12 rounded-[2rem] border-2 border-dashed border-[var(--border)] bg-[var(--background)]/50 text-sm font-bold text-slate-500 m-4">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500 ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {rows.map((row, index) => (
            <tr
              key={getRowKey ? getRowKey(row, index) : index}
              className="bg-[var(--card)] transition-colors hover:bg-[var(--background)]/80 group"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 align-middle text-sm text-[var(--foreground)] ${column.className ?? ''}`}
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