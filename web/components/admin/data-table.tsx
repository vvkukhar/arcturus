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

export function DataTable<T>({ columns, rows, emptyText = 'No data', getRowKey }: Props<T>) {
  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 rounded-[2rem] border-2 border-dashed border-[var(--border)] bg-[var(--background)]/50 text-sm font-bold text-slate-500 m-4 text-center">
        {emptyText}
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500 ${column.className ?? ''}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.map((row, index) => (
              <tr key={getRowKey ? getRowKey(row, index) : index} className="bg-[var(--card)] transition-colors hover:bg-[var(--background)]/80 group">
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-4 align-middle text-sm text-[var(--foreground)] ${column.className ?? ''}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {rows.map((row, index) => (
          <div key={getRowKey ? getRowKey(row, index) : index} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
            {columns.map((column) => {
              if (!column.header) return <div key={column.key} className="w-full flex justify-end">{column.render(row)}</div>;
              return (
                <div key={column.key} className="flex justify-between items-center gap-4 border-b border-[var(--border)] pb-2 last:border-0 last:pb-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 shrink-0">{column.header}</span>
                  <div className="text-right text-sm text-[var(--foreground)] truncate max-w-[60%]">{column.render(row)}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}