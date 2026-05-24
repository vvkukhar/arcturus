'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useI18n } from '@/components/providers/i18n-provider';
import { User, Package, Settings, TrendingUp, Loader2, Store, Clock, CheckCircle2, XCircle, Wallet, ArrowRight, CreditCard } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AccountPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'orders' | 'listings' | 'wallet' | 'settings'>('listings');
  
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutCard, setPayoutCard] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const { data: user, isLoading: uLoading } = useSWR('/api/auth/me', swrFetcher as any);
  const { data: listings, isLoading: lLoading } = useSWR<any[]>('/api/proxy/marketplace/my-listings', swrFetcher);
  const { data: finance, isLoading: fLoading, mutate: mutateFinance } = useSWR<any>('/api/proxy/marketplace/finance', swrFetcher);

  if (uLoading || lLoading || fLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  const myListings = Array.isArray(listings) ? listings : [];

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRequesting) return;
    try {
      setIsRequesting(true);
      await apiFetch('/api/proxy/marketplace/payout', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(payoutAmount), cardData: payoutCard }),
      });
      toast.success('Запит на виплату успішно створено!');
      setPayoutAmount('');
      setPayoutCard('');
      mutateFinance();
    } catch (err: any) {
      toast.error(err.message || 'Помилка створення запиту');
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-[10px] font-black uppercase"><CheckCircle2 size={12}/> В продажі</span>;
    if (status === 'rejected') return <span className="flex items-center gap-1 text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-[10px] font-black uppercase"><XCircle size={12}/> Відхилено</span>;
    return <span className="flex items-center gap-1 text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded text-[10px] font-black uppercase"><Clock size={12}/> Модерація</span>;
  };

  return (
    <div className="min-h-screen py-12 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-[var(--border)] pb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t('account.title' as any)}</h1>
              <p className="text-slate-500 font-medium mt-1">{user?.email || 'investor@arcturus.store'}</p>
            </div>
          </div>
          <div className="bg-[var(--card)] px-6 py-4 rounded-2xl border border-[var(--border)] shadow-sm">
            <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Баланс (Доступно)</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{formatMoney(finance?.availableBalance || 0)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'listings', icon: Store, label: 'Мої товари' },
              { id: 'wallet', icon: Wallet, label: 'Гаманець та Виплати' },
              { id: 'orders', icon: Package, label: 'Мої покупки' },
              { id: 'settings', icon: Settings, label: 'Налаштування' }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all border ${activeTab === tab.id ? 'bg-[var(--card)] text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900 shadow-sm' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-[var(--card)] hover:text-[var(--foreground)] border-transparent hover:border-[var(--border)]'}`}
                >
                  <Icon size={20} /> {tab.label}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-9 space-y-8">
            <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col min-h-[500px]">
                
                {/* --- ТАБ: ТОВАРИ --- */}
                {activeTab === 'listings' && (
                  <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-black mb-6">Мої товари на маркетплейсі</h2>
                    {myListings.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-[var(--border)] rounded-3xl">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-400 mb-4"><Store size={28} /></div>
                        <p className="text-lg font-bold mb-2">Ви ще нічого не продаєте</p>
                        <p className="text-slate-500 font-medium">Заповніть заявку, щоб виставити товар на продаж.</p>
                      </div>
                    ) : (
                      myListings.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-2xl bg-[var(--background)] hover:shadow-md transition-shadow">
                          <div className="h-16 w-16 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center border border-[var(--border)] overflow-hidden relative shrink-0">
                            {item.images?.[0]?.imageUrl ? <Image src={item.images[0].imageUrl} fill alt="" className="object-cover" /> : <Package size={24} className="text-slate-300" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[var(--foreground)] truncate text-lg">{item.titleSnapshot}</h4>
                            <p className="text-xs text-slate-500 mt-1 font-mono">ID: {item.id.slice(0,8)} • Створено: {new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="font-black text-lg">{formatMoney(item.expectedSalePriceManual ?? item.purchasePrice)}</span>
                            {getStatusBadge(item.approvalStatus)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* --- ТАБ: ГАМАНЕЦЬ (ФІНАНСИ) --- */}
                {activeTab === 'wallet' && (
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-2xl font-black mb-6">Фінанси та Виплати</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Доступно до виводу</div>
                        <div className="text-4xl font-black text-emerald-400">{formatMoney(finance?.availableBalance || 0)}</div>
                        <div className="mt-4 text-xs font-medium text-slate-400">В процесі виплати: {formatMoney(finance?.processingAmount || 0)}</div>
                      </div>
                      <div className="p-6 rounded-3xl bg-[var(--background)] border border-[var(--border)]">
                        <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Всього зароблено</div>
                        <div className="text-4xl font-black text-[var(--foreground)]">{formatMoney(finance?.totalEarned || 0)}</div>
                        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-500">
                          <TrendingUp size={14} /> Тільки успішні угоди
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Форма виводу */}
                      <form onSubmit={handlePayoutRequest} className="bg-[var(--background)] p-6 rounded-3xl border border-[var(--border)] space-y-5">
                        <h3 className="font-black text-lg">Замовити виплату</h3>
                        <div>
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2">Сума (UAH)</label>
                          <input 
                            required type="number" min="100" max={finance?.availableBalance || 0}
                            value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)}
                            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2">Номер картки</label>
                          <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                              required type="text"
                              value={payoutCard} onChange={e => setPayoutCard(e.target.value)}
                              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 pl-12 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="0000 0000 0000 0000"
                            />
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          disabled={isRequesting || !payoutAmount || Number(payoutAmount) > (finance?.availableBalance || 0)}
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/20"
                        >
                          {isRequesting ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                          Вивести кошти
                        </button>
                      </form>

                      {/* Історія запитів */}
                      <div>
                        <h3 className="font-black text-lg mb-4">Історія виплат</h3>
                        <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                          {finance?.payoutRequests?.length === 0 ? (
                            <div className="text-sm font-medium text-slate-400">Немає історії виплат.</div>
                          ) : (
                            finance?.payoutRequests?.map((req: any) => (
                              <div key={req.id} className="flex items-center justify-between p-4 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
                                <div>
                                  <div className="font-black text-[var(--foreground)]">{formatMoney(req.amount)}</div>
                                  <div className="text-xs font-mono text-slate-500 mt-1">{new Date(req.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div>
                                  {req.status === 'pending' && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-black uppercase">В обробці</span>}
                                  {req.status === 'paid' && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-black uppercase">Виплачено</span>}
                                  {req.status === 'rejected' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-black uppercase">Відхилено</span>}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-[var(--border)] rounded-3xl">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4"><Package size={28} /></div>
                    <p className="text-lg font-bold mb-2">Ви ще нічого не купували</p>
                    <p className="text-slate-500 font-medium">Ваші придбані товари відображатимуться тут.</p>
                  </div>
                )}
                
                {activeTab === 'settings' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-[var(--border)] rounded-3xl">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4"><Settings size={28} /></div>
                    <p className="text-lg font-bold mb-2">Налаштування профілю</p>
                    <p className="text-slate-500 font-medium">Керування паролем та нотифікаціями скоро з'явиться.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}