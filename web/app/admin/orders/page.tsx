'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { apiFetch } from '@/lib/api';
import { Package, Truck, Loader2, FileText, AlertTriangle, Weight, X } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney } from '@/lib/format';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminOrdersListPage() {
  const { data: orders, isLoading, mutate } = useSWR<any[]>('/api/proxy/orders', swrFetcher, { refreshInterval: 10000 }); 
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  
  const [globalWeight, setGlobalWeight] = useState('2.5');
  const [individualWeights, setIndividualWeights] = useState<Record<string, string>>({});

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

  const handleOpenTtnModal = () => {
    const validIds = Array.from(selectedIds).filter(id => {
      const order = rows.find(r => r.id === id);
      return order && !order.adminNote?.includes('[TTN:');
    });

    if (validIds.length === 0) {
      toast.info('Всі обрані замовлення вже мають згенеровані ТТН.');
      return;
    }
    
    setShowWeightModal(true);
  };

  const handleBulkTTN = async () => {
    const validIds = Array.from(selectedIds).filter(id => {
      const order = rows.find(r => r.id === id);
      return order && !order.adminNote?.includes('[TTN:');
    });

    if (validIds.length === 0 || processing) return;

    const payloadOrders = validIds.map(id => ({
      orderId: id,
      weight: Number(individualWeights[id] || globalWeight || 2.5)
    }));

    try {
      setProcessing(true);
      const res = await apiFetch<any>('/api/admin/orders/bulk-ttn', {
        method: 'POST',
        body: JSON.stringify({ orders: payloadOrders })
      });
      
      const data = res.data;
      
      if (data && data.success > 0) {
        toast.success(`Успішно згенеровано ТТН для ${data.success} з ${data.processed} замовлень!`);
      } else if (data && data.success === 0 && data.results?.length > 0) {
        toast.error(`Помилка генерації ТТН: ${data.results[0].reason}`);
      } else {
        toast.error('Не вдалося згенерувати ТТН.');
      }

      setSelectedIds(new Set());
      setShowWeightModal(false);
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Помилка при генерації ТТН');
    } finally {
      setProcessing(false);
    }
  };

  const handlePrintPDF = async () => {
    const validIds = Array.from(selectedIds).filter(id => {
      const order = rows.find(r => r.id === id);
      return order && order.adminNote?.includes('[TTN:');
    });

    if (validIds.length === 0 || processing) {
      toast.error('Оберіть хоча б одне замовлення з вже згенерованою ТТН.');
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
        toast.success('Термо-етикетки (100х100) готові до друку!');
        setSelectedIds(new Set());
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated pb-10 relative">
      
      {showWeightModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-2 text-[var(--foreground)]">
                <Weight className="text-blue-500" /> Габарити відправок
              </h2>
              <button onClick={() => setShowWeightModal(false)} className="text-slate-400 hover:bg-[var(--background)] p-2 rounded-full">
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6 border-b border-[var(--border)] bg-blue-50/50 dark:bg-blue-900/10">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Базова вага для всіх (КГ)</label>
              <input 
                type="number" 
                value={globalWeight} 
                onChange={e => setGlobalWeight(e.target.value)}
                className="w-full h-14 bg-white dark:bg-black border border-[var(--border)] px-4 rounded-xl font-black text-xl outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Або вкажіть індивідуальну вагу:</h3>
              {selectedOrders.filter(o => !o.adminNote?.includes('[TTN:')).map(order => (
                <div key={order.id} className="flex items-center gap-4 bg-[var(--background)] p-4 rounded-xl border border-[var(--border)]">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate text-[var(--foreground)]">{order.productTitle}</div>
                    <div className="text-xs text-slate-500">{order.buyerName}</div>
                  </div>
                  <div className="w-24 shrink-0">
                    <input 
                      type="number"
                      placeholder={globalWeight}
                      value={individualWeights[order.id] || ''}
                      onChange={e => setIndividualWeights(prev => ({...prev, [order.id]: e.target.value}))}
                      className="w-full h-10 px-3 border border-[var(--border)] bg-[var(--card)] rounded-lg text-sm font-bold outline-none focus:border-blue-500 text-center"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-[var(--border)] flex justify-end gap-3 bg-[var(--background)]">
              <button onClick={() => setShowWeightModal(false)} className="px-6 py-3 font-bold text-slate-500">Скасувати</button>
              <button 
                onClick={handleBulkTTN} 
                disabled={processing}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {processing ? <Loader2 className="animate-spin" size={18} /> : <Truck size={18} />}
                Створити ТТН
              </button>
            </div>
          </div>
        </div>
      )}


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
                onClick={handleOpenTtnModal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                <Truck size={16} /> Generate TTNs
              </button>
            )}
            {canPrintPdf && (
              <button
                disabled={processing}
                onClick={handlePrintPDF}
                className="flex items-center gap-2 bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {processing ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                Print Zebra (100x100)
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
              key: 'payment',
              header: 'Payment',
              render: (row) => {
                const isPaid = row.status === 'paid' || row.channel === 'paid_upfront';
                return (
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-black text-[var(--foreground)]">{formatMoney(row.sellPrice)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase ${isPaid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {isPaid ? 'Оплачено' : 'Післяплата (COD)'}
                    </span>
                  </div>
                );
              }
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusPill value={row.status} />,
            },
            {
              key: 'logistics',
              header: 'Logistics (NP)',
              render: (row) => {
                const match = row.adminNote?.match(/\[TTN:\s*(\d+)\]/);
                const ttn = match ? match[1] : null;
                const deliveryStatus = row.deliveryStatus;

                return ttn ? (
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-mono font-black text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-md text-xs border border-blue-200 dark:border-blue-800">
                      {ttn}
                    </span>
                    {deliveryStatus && (
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        deliveryStatus.includes('Отримано') ? 'text-emerald-500' :
                        deliveryStatus.includes('Відмова') ? 'text-red-500' : 'text-slate-500'
                      }`}>
                        {deliveryStatus}
                      </span>
                    )}
                  </div>
                ) : <span className="text-slate-400 font-medium text-xs">Not generated</span>;
              }
            }
          ]}
        />
      </SectionCard>
    </div>
  );
}