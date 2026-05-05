'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/components/providers/i18n-provider';
import { User, Package, Heart, Settings, TrendingUp, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from '@/lib/client-api';
import { formatMoney } from '@/lib/format';

export default function AccountPage() {
  const { t } = useI18n();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders');

  useEffect(() => {
    let mounted = true;
    Promise.all([
      apiFetch('/api/portfolio/summary').catch(() => null),
      apiFetch('/api/profit/monthly').catch(() => []),
      apiFetch('/api/auth/me').catch(() => null)
    ]).then(([portfolioData, historyData, userData]) => {
      if (mounted) {
        setPortfolio(portfolioData);
        if (Array.isArray(historyData)) {
           setHistory(historyData.map((d: any) => ({ month: d.date || d.month, value: d.netProfit || d.revenue || 0 })));
        }
        setUser(userData);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  const portfolioValue = portfolio?.inventory?.expectedRevenue ?? 0;
  const realizedProfit = portfolio?.sales?.realizedProfit ?? 0;

  return (
    <div className="min-h-screen py-12 md:py-16 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-[var(--border)] pb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t('account.title')}</h1>
              <p className="text-slate-500 font-medium mt-1">{user?.email || 'investor@arcturus.store'}</p>
            </div>
          </div>
          <div className="bg-[var(--card)] px-6 py-4 rounded-2xl border border-[var(--border)] shadow-sm">
            <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">{t('account.portfolioValue')}</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black">{formatMoney(portfolioValue)}</span>
              {realizedProfit > 0 && (
                <span className="flex items-center gap-1 text-green-500 font-bold text-sm mb-1">
                  <TrendingUp size={16} /> Realized: {formatMoney(realizedProfit)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all border ${activeTab === 'orders' ? 'bg-[var(--card)] text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900 shadow-sm' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-[var(--card)] hover:text-[var(--foreground)] border-transparent hover:border-[var(--border)]'}`}
            >
              <Package size={20} /> {t('account.orders')}
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all border ${activeTab === 'wishlist' ? 'bg-[var(--card)] text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900 shadow-sm' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-[var(--card)] hover:text-[var(--foreground)] border-transparent hover:border-[var(--border)]'}`}
            >
              <Heart size={20} /> {t('account.wishlist')}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all border ${activeTab === 'settings' ? 'bg-[var(--card)] text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900 shadow-sm' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-[var(--card)] hover:text-[var(--foreground)] border-transparent hover:border-[var(--border)]'}`}
            >
              <Settings size={20} /> {t('account.settings')}
            </button>
          </div>

          <div className="lg:col-span-9 space-y-8">
            <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden p-6 md:p-8">
              <h2 className="text-xl font-black mb-6">{t('account.assetGrowth')}</h2>
              <div className="h-[300px] w-full">
                {history.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 font-medium">No historical data available yet.</div>
                )}
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-[var(--border)]">
                <h2 className="text-xl font-black">
                  {activeTab === 'orders' && t('account.orders')}
                  {activeTab === 'wishlist' && t('account.wishlist')}
                  {activeTab === 'settings' && t('account.settings')}
                </h2>
              </div>
              <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
                {activeTab === 'orders' && (
                  <>
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                      <Package size={28} />
                    </div>
                    <p className="text-lg font-bold mb-2">{t('account.noPositions')}</p>
                    <p className="text-slate-500 font-medium">{t('account.noPositionsDesc')}</p>
                  </>
                )}
                {activeTab === 'wishlist' && (
                  <>
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-400 mb-4">
                      <Heart size={28} />
                    </div>
                    <p className="text-lg font-bold mb-2">No Saved Items</p>
                    <p className="text-slate-500 font-medium">Items you favorite in the catalog will appear here.</p>
                  </>
                )}
                {activeTab === 'settings' && (
                  <>
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                      <Settings size={28} />
                    </div>
                    <p className="text-lg font-bold mb-2">System Preferences</p>
                    <p className="text-slate-500 font-medium">Adjust your language and notifications here.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}