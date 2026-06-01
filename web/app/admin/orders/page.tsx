// call:function_1{"queries":["web/app/admin/orders/page.tsx"]}
'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { apiFetch } from '@/lib/api';
import { Package, Truck, Loader2, FileText, AlertTriangle } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney } from '@/lib/format';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminOrdersListPage() {
  const { data: orders, isLoading, mutate } = useSWR<any[]>('/api/proxy/orders', swrFetcher);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);

  const rows = Array.isArray(orders) ? orders : [];
  const actionableRows = rows.filter(r => ['approved', 'contacted', 'pending', 'paid'].includes(r.status));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === actionableRows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(actionableRows.map(r => r.id)));
    }
  };

  const handleBulkTTN = async () => {
    // 🔥 ФІКС: Відправляємо на бекенд тільки ті ID, в яких ще немає ТТН
    const validIds = Array.from(selectedIds).filter(id => {
      const order = rows.find(r => r.id === id);
      return order && !order.adminNote?.includes('[TTN:');
    });

    if (validIds.length === 0 || processing) {
      toast.info('Всі обрані замовлення вже мають згенеровані ТТН.');
      return;
    }

    try {
      setProcessing(true);
      const res = await apiFetch<any>('/api/admin/orders/bulk-ttn', {
        method: 'POST',
        body: JSON.stringify({ orderIds: validIds })
      });
      
      toast.success(`Успішно згенеровано ТТН для ${res.success} замовлень!`);
      setSelectedIds(new Set());
      mutate();
    } catch (err: any) {
      // Якщо немає АПІ Ключа, він красиво напише про це у тості
      toast.error(err.message || 'Помилка при генерації ТТН');
    } finally {
      setProcessing(false);
    }
  };

  const handlePrintPDF = async () => {
    // 🔥 ФІКС: Відправляємо на друк тільки ті ID, де ТТН вже створено
    const validIds = Array.from(selectedIds).filter(id => {
      const order = rows.find(r => r.id === id);
      return order && order.adminNote?.includes('[TTN:');
    });

    if (validIds.length === 0 || processing) {
      toast.error('Оберіть хоча б одне замовлення з уже згенерованою ТТН.');
      return;
    }

    try {
      setProcessing(true);
      const res = await apiFetch<any>('/api/admin/orders/bulk-pdf', {
        method: 'POST',
        body: JSON.stringify({ orderIds: validIds })
      });
      
      if (res.data?.url) {
        window.open(res.data.url, '_blank');
        toast.success(`Відкриваємо PDF для ${validIds.length} накладних`);
      } else {
        throw new Error('No URL returned');
      }
    } catch (err: any) {
      toast.error(err.message || 'Помилка генерації PDF');
    } finally {
      setProcessing(false);
    }
  };

  const selectedOrders = rows.filter(r => selectedIds.has(r.id));
  const canGenerateTtn = selectedOrders.some(r => !r.adminNote?.includes('[TTN:'));
  const canPrintPdf = selectedOrders.some(r => r.adminNote?.includes('[TTN:'));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Orders Registry</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Bulk logistics processing node. Generate and print mass TTNs.</p>
          </div>
        </div>
        
        {selectedIds.size > 0 && (
          <div className="flex gap-2 animate-in fade-in">
            {canGenerateTtn && (
              <button
                disabled={processing}
                onClick={handleBulkTTN}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                {processing ? <Loader2 className="animate-spin" size={16} /> : <Truck size={16} />}
                Generate TTNs
              </button>
            )}
            {canPrintPdf && (
              <button
                disabled={processing}
                onClick={handlePrintPDF}
                className="flex items-center gap-2 bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {processing ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                Print PDF
              </button>
            )}
          </div>
        )}
      </div>

      <SectionCard title="Orders Backlog">
        <DataTable
          rows={rows}
          emptyText={isLoading ? "Loading orders data..." : "No custom orders found."}
          getRowKey={(row) => row.id}
          columns={[
            {
              key: 'checkbox',
              header: '',
              className: 'w-10',
              render: (row) => {
                const isActionable = ['approved', 'contacted', 'pending', 'paid'].includes(row.status) || row.adminNote?.includes('[TTN:');
                if (!isActionable) return null;
                return (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleSelect(row.id)}
                    className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer focus:ring-0"
                  />
                );
              }
            },
            {
              key: 'order',
              header: 'Order Details',
              render: (row) => (
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--foreground)] text-base line-clamp-1 max-w-sm">{row.productTitle}</span>
                  <span className="text-xs font-mono text-slate-400 mt-0.5 uppercase tracking-wider">ID: #{row.id.slice(-8)} • {new Date(row.createdAt).toLocaleDateString()}</span>
                </div>
              ),
            },
            {
              key: 'buyer',
              header: 'Client',
              render: (row) => (
                <div className="flex flex-col">
                  <span className="font-bold flex items-center gap-2">
                    {row.buyerName}
                    {row.clientProfile?.status === 'blacklisted' && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1">
                        <AlertTriangle size={12}/> Scam Risk
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-medium text-slate-500 mt-0.5">{row.contact}</span>
                </div>
              ),
            },
            {
              key: 'price',
              header: 'Sell Price',
              render: (row) => <span className="font-black text-[var(--foreground)]">{formatMoney(row.sellPrice)}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusPill value={row.status} />,
            },
            {
              key: 'logistics',
              header: 'Waybill (TTN)',
              render: (row) => {
                const match = row.adminNote?.match(/\[TTN:\s*(\d+)\]/);
                const ttn = match ? match[1] : null;
                return ttn ? (
                  <span className="font-mono font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md text-xs border border-emerald-200">
                    {ttn}
                  </span>
                ) : <span className="text-slate-400 font-medium text-xs">Not generated</span>;
              }
            }
          ]}
        />
      </SectionCard>
    </div>
  );
}