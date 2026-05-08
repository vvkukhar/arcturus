import Link from 'next/link';
import { api } from '@/lib/api';
import type { ReserveRequest } from '@/lib/types';
import { Clock, CheckCircle2, PhoneCall, XCircle, Package } from 'lucide-react';

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

function KanbanColumn({ 
  title, 
  items, 
  colorClass, 
  headerClass,
  icon: Icon
}: { 
  title: string; 
  items: ReserveRequest[]; 
  colorClass: string;
  headerClass: string;
  icon: any;
}) {
  return (
    <div className="flex flex-col h-full rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-500/20 group">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${headerClass}`}>
            <Icon size={18} />
          </div>
          <h3 className="text-lg font-black text-[var(--foreground)] tracking-tight">{title}</h3>
        </div>
        <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-black shadow-sm ${colorClass}`}>
          {items.length}
        </span>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] text-sm font-bold text-slate-400 bg-[var(--background)]/50">
            <Package size={24} className="mb-2 opacity-50" />
            Empty
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/reserves/${item.id}`}
              className="group/card block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="font-black text-[var(--foreground)] group-hover/card:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {item.productTitle || 'Unknown Product'}
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-[var(--border)] pt-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                  <span className="text-xs font-medium text-slate-500 truncate max-w-[140px]">{item.contact}</span>
                </div>
                <span className="text-[10px] font-black font-mono tracking-widest text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
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
    <div className="h-[calc(100vh-8rem)] min-h-[600px] flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Order Status Board</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Visual kanban pipeline for reserve requests and order progression.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-hidden pb-4">
        <KanbanColumn 
          title="Pending" 
          items={board.pending} 
          icon={Clock}
          colorClass="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" 
          headerClass="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-500"
        />
        <KanbanColumn 
          title="Approved" 
          items={board.approved} 
          icon={CheckCircle2}
          colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
          headerClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-500"
        />
        <KanbanColumn 
          title="Contacted" 
          items={board.contacted} 
          icon={PhoneCall}
          colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
          headerClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-500"
        />
        <KanbanColumn 
          title="Rejected" 
          items={board.rejected} 
          icon={XCircle}
          colorClass="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
          headerClass="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-500"
        />
      </div>
    </div>
  );
}