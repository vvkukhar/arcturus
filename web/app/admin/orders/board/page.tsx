import Link from 'next/link';
import { api } from '@/lib/api';
import type { ReserveRequest } from '@/lib/types';

type BoardData = {
  pending: ReserveRequest[];
  approved: ReserveRequest[];
  contacted: ReserveRequest[];
  rejected: ReserveRequest[];
};

async function getBoard(): Promise<BoardData> {
  try {
    return await api.get<BoardData>('/public/reserve-board');
  } catch {
    return { pending: [], approved: [], contacted: [], rejected: [] };
  }
}

function KanbanColumn({ title, items, colorClass }: { title: string; items: ReserveRequest[]; colorClass: string }) {
  return (
    <div className="flex flex-col h-full rounded-3xl border border-border bg-slate-50/50 p-4">
      <div className="mb-4 flex items-center justify-between px-2">
        <h3 className="text-lg font-black text-slate-800">{title}</h3>
        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${colorClass}`}>
          {items.length}
        </span>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm font-medium text-slate-400">
            Empty
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/reserves/${item.id}`}
              className="group block rounded-2xl border border-border bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md hover:ring-1 hover:ring-blue-100"
            >
              <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {item.productTitle || 'Unknown Product'}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                  <span className="text-xs text-slate-400 truncate max-w-[120px]">{item.contact}</span>
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-300 uppercase">
                  {item.id.slice(-6)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default async function OrdersBoardPage() {
  const board = await getBoard();

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[600px] flex flex-col space-y-4 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Order Status Board</h1>
        <p className="mt-1 text-sm text-slate-500">Visual kanban pipeline for reserve requests.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-hidden pb-4">
        <KanbanColumn title="Pending" items={board.pending} colorClass="bg-amber-100 text-amber-700" />
        <KanbanColumn title="Approved" items={board.approved} colorClass="bg-emerald-100 text-emerald-700" />
        <KanbanColumn title="Contacted" items={board.contacted} colorClass="bg-blue-100 text-blue-700" />
        <KanbanColumn title="Rejected" items={board.rejected} colorClass="bg-red-100 text-red-700" />
      </div>
    </div>
  );
}