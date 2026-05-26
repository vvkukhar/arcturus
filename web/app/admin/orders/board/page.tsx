import Link from 'next/link';
import { api } from '@/lib/api';
import { Clock, CheckCircle2, PhoneCall, XCircle, Package, Receipt, Truck } from 'lucide-react';
import { formatMoney } from '@/lib/format';

export const revalidate = 0;

async function getBoard(): Promise<any> {
  try {
    return await api.get<any>('/orders/board');
  } catch {
    return { pending: [], approved: [], contacted: [], sold: [], cancelled: [] };
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
  items: any[]; 
  colorClass: string;
  headerClass: string;
  icon: any;
}) {
  const columnTotal = items.reduce((sum, item) => sum + (item.sellPrice || 0), 0);

  return (
    <div className="flex flex-col h-full rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-500/20 group">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${headerClass}`}>
            <Icon size={18} />
          </div>
          <h3 className="text-lg font-black text-[var(--foreground)] tracking-tight">{title}</h3>
        </div>
        <span className={`inline-flex items-center justify-center h-7 px-3 rounded-full text-xs font-black shadow-sm ${colorClass}`}>
          {items.length}
        </span>
      </div>
      
      {columnTotal > 0 && (
        <div className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">
          Total: {formatMoney(columnTotal)}
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] text-sm font-bold text-slate-500 bg-[var(--background)]/50">
            <Package size={24} className="mb-2 opacity-50" />
            Empty
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/orders/${item.id}`}
              className="group/card block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="font-black text-[var(--foreground)] group-hover/card:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {item.productTitle || 'Unknown Product'}
              </div>
              <div className="text-blue-600 dark:text-blue-400 font-black mt-2 text-lg">
                {item.sellPrice ? formatMoney(item.sellPrice) : 'Processing...'}
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-[var(--border)] pt-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.buyerName}</span>
                  <span className="text-xs font-medium text-slate-500 truncate max-w-[140px]">{item.contact}</span>
                </div>
                <span className="text-[10px] font-black font-mono tracking-widest text-slate-400 uppercase bg-[var(--background)] px-2 py-1 rounded-md border border-[var(--border)]">
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
        <p className="mt-1 text-sm font-medium text-slate-500">Visual kanban pipeline for order fulfillment and shipping.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-hidden pb-4">
        <KanbanColumn 
          title="Pending / Approved" 
          items={[...board.pending, ...board.approved]} 
          icon={Clock}
          colorClass="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" 
          headerClass="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-500"
        />
        <KanbanColumn 
          title="Contacted" 
          items={board.contacted} 
          icon={PhoneCall}
          colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
          headerClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-500"
        />
        <KanbanColumn 
          title="Sold & Shipped" 
          items={board.sold} 
          icon={Truck}
          colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
          headerClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-500"
        />
        <KanbanColumn 
          title="Cancelled" 
          items={board.cancelled} 
          icon={XCircle}
          colorClass="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
          headerClass="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-500"
        />
      </div>
    </div>
  );
}