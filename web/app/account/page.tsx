'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useI18n } from '@/components/providers/i18n-provider';
import { WalletPanel } from '@/components/account/wallet-panel';
import { User, Package, Settings, Loader2, Store, Clock, CheckCircle2, XCircle, Wallet, Lock, Mail, Save, Handshake, Check, X, Terminal, Copy } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'listings' | 'wallet' | 'settings' | 'developer'>('listings');
  
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  const [generatingKey, setGeneratingKey] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const { data: user, isLoading: uLoading, mutate: mutateUser } = useSWR('/api/auth/me', swrFetcher as any, {
    onSuccess: (data) => {
      if (data && !profileName) {
        setProfileName(data.name || '');
        setProfileEmail(data.email || '');
      }
    }
  });

  const { data: listings, isLoading: lLoading } = useSWR<any[]>('/api/proxy/marketplace/my-listings', swrFetcher);
  const { data: finance, isLoading: fLoading, mutate: mutateFinance } = useSWR<any>('/api/proxy/marketplace/finance', swrFetcher);
  
  const { data: myOffers, mutate: mutateMyOffers } = useSWR<any[]>('/api/proxy/offers/my-offers', swrFetcher);
  const { data: incomingOffers, mutate: mutateIncomingOffers } = useSWR<any[]>('/api/proxy/offers/incoming', swrFetcher);

  if (uLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  const myListings = Array.isArray(listings) ? listings : [];
  const safeMyOffers = Array.isArray(myOffers) ? myOffers : [];
  const safeIncomingOffers = Array.isArray(incomingOffers) ? incomingOffers : [];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProfile) return;
    try {
      setIsSavingProfile(true);
      await apiFetch('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({ 
          name: profileName, 
          email: profileEmail, 
          password: profilePassword ? profilePassword : undefined 
        }),
      });
      
      toast.success('Профіль успішно оновлено!');
      setProfilePassword('');
      mutateUser();
      
      if (profilePassword) {
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (err: any) {
      toast.error(err.message || 'Помилка оновлення профілю');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleGenerateApiKey = async () => {
    if (generatingKey) return;
    try {
      setGeneratingKey(true);
      await apiFetch('/api/auth/api-key', { method: 'POST' });
      toast.success('Новий API Key згенеровано!');
      mutateUser();
    } catch (err: any) {
      toast.error(err.message || 'Не вдалося згенерувати API ключ');
    } finally {
      setGeneratingKey(false);
    }
  };

  const copyApiKey = () => {
    if (user?.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      setApiKeyCopied(true);
      setTimeout(() => setApiKeyCopied(false), 2000);
    }
  };

  const handleOfferResponse = async (offerId: string, action: 'accept' | 'reject') => {
    try {
      setRespondingId(`${action}-${offerId}`);
      await apiFetch(`/api/proxy/offers/${offerId}/respond`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      });
      toast.success(action === 'accept' ? 'Пропозицію прийнято!' : 'Пропозицію відхилено');
      mutateIncomingOffers();
    } catch (err: any) {
      toast.error(err.message || 'Не вдалося обробити пропозицію');
    } finally {
      setRespondingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-[10px] font-black uppercase"><CheckCircle2 size={12}/> В продажу</span>;
    if (status === 'rejected') return <span className="flex items-center gap-1 text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-[10px] font-black uppercase"><XCircle size={12}/> Відхилено</span>;
    return <span className="flex items-center gap-1 text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded text-[10px] font-black uppercase"><Clock size={12}/> Модерація</span>;
  };

  const getOfferStatusPill = (status: string) => {
    if (status === 'accepted') return <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">Прийнято</span>;
    if (status === 'rejected') return <span className="text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">Відхилено</span>;
    return <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">Очікує</span>;
  };

  const tabs = [
    { id: 'listings', icon: Store, label: 'Мої товари' },
    { id: 'wallet', icon: Wallet, label: 'Гаманець та Офери' },
    { id: 'orders', icon: Package, label: 'Мої покупки' },
    { id: 'settings', icon: Settings, label: 'Налаштування' }
  ];

  if (user?.isPro || user?.role === 'admin' || user?.role === 'operator') {
    tabs.push({ id: 'developer', icon: Terminal, label: 'Developer API' });
  }

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-2">
            {tabs.map((tab) => {
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
                
                {activeTab === 'listings' && (
                  <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-black mb-6">Мої товари на маркетплейсі</h2>
                    
                    {lLoading ? (
                      <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>
                    ) : myListings.length === 0 ? (
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

                {activeTab === 'wallet' && (
                  <div className="flex-1 flex flex-col space-y-10">
                    <WalletPanel finance={finance} mutateFinance={mutateFinance} isLoading={fLoading} />

                    <div className="border-t border-[var(--border)] pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2"><Handshake size={18} className="text-blue-500"/> Вхідний торг (C2C)</h3>
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                          {safeIncomingOffers.length === 0 ? (
                            <p className="text-sm font-medium text-slate-400">Ніхто поки не пропонував меншу ціну за ваші набори.</p>
                          ) : (
                            safeIncomingOffers.map((off: any) => (
                              <div key={off.id} className="p-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl flex flex-col gap-3">
                                <div>
                                  <div className="font-bold text-sm truncate">{off.inventoryItem?.titleSnapshot}</div>
                                  <div className="text-xs text-slate-500 font-medium mt-0.5">Покупець: {off.buyer?.name}</div>
                                </div>
                                <div className="flex justify-between items-center bg-[var(--card)] px-3 py-2 rounded-xl border border-[var(--border)] text-sm">
                                  <span className="text-slate-500 font-bold">Пропонує:</span>
                                  <span className="font-black text-indigo-500">{formatMoney(off.amount)}</span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    disabled={respondingId !== null}
                                    onClick={() => handleOfferResponse(off.id, 'accept')}
                                    className="flex-1 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black text-xs uppercase tracking-wider rounded-xl transition-colors flex justify-center items-center gap-1"
                                  >
                                    {respondingId === `accept-${off.id}` ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Прийняти
                                  </button>
                                  <button
                                    disabled={respondingId !== null}
                                    onClick={() => handleOfferResponse(off.id, 'reject')}
                                    className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-black text-xs uppercase tracking-wider rounded-xl transition-colors flex justify-center items-center gap-1"
                                  >
                                    {respondingId === `reject-${off.id}` ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />} Відхилити
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-black text-lg mb-4">Надіслані пропозиції</h3>
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                          {safeMyOffers.length === 0 ? (
                            <p className="text-sm font-medium text-slate-400">Ви ще не пропонували свою ціну на товари інших продавців.</p>
                          ) : (
                            safeMyOffers.map((off: any) => (
                              <div key={off.id} className="p-4 border border-[var(--border)] rounded-2xl flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="font-bold text-sm truncate">{off.inventoryItem?.titleSnapshot}</div>
                                  <div className="text-sm font-black text-indigo-500 mt-1">Ви запропонували: {formatMoney(off.amount)}</div>
                                </div>
                                <div className="shrink-0">
                                  {getOfferStatusPill(off.status)}
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
                  <div className="flex-1 max-w-xl">
                    <h2 className="text-2xl font-black mb-6">Налаштування профілю</h2>
                    
                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Повне Ім'я</label>
                        <div className="relative">
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            required
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 pl-12 text-sm font-bold text-[var(--foreground)] shadow-sm transition-all focus:border-blue-500 focus:bg-[var(--card)] focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email</label>
                        <div className="relative">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            required
                            type="email"
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 pl-12 text-sm font-bold text-[var(--foreground)] shadow-sm transition-all focus:border-blue-500 focus:bg-[var(--card)] focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Новий Пароль (Опціонально)</label>
                        <div className="relative">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="password"
                            value={profilePassword}
                            onChange={(e) => setProfilePassword(e.target.value)}
                            placeholder="Залишіть пустим, якщо не змінюєте"
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 pl-12 text-sm font-bold text-[var(--foreground)] shadow-sm transition-all focus:border-blue-500 focus:bg-[var(--card)] focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                          />
                        </div>
                        {profilePassword && <p className="text-xs text-amber-500 font-bold ml-1 mt-1">Зміна пароля вимагатиме повторної авторизації.</p>}
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSavingProfile || !profileName.trim() || !profileEmail.trim()}
                          className="w-full h-14 text-base rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSavingProfile ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                          Зберегти Зміни
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'developer' && (
                  <div className="flex-1 max-w-2xl animate-in fade-in slide-in-from-right-4">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Terminal className="text-indigo-500" /> B2B Developer API</h2>
                    <p className="text-slate-500 font-medium mb-8">
                      Використовуйте API для створення власних ботів, інтеграції цін або автоматизації дропшипінгу з платформою Arcturus.
                    </p>

                    <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5"><Terminal size={150} /></div>
                      <div className="relative z-10">
                        <h3 className="text-lg font-black mb-2">Ваш API Key</h3>
                        
                        {user?.apiKey ? (
                          <div className="space-y-4">
                            <div className="bg-black border border-slate-700 p-4 rounded-xl flex items-center justify-between gap-4">
                              <code className="font-mono text-emerald-400 text-sm break-all">{user.apiKey}</code>
                              <button 
                                onClick={copyApiKey}
                                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-300 hover:text-white transition-colors shrink-0"
                              >
                                {apiKeyCopied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Доступ:</span>
                              <span className="text-xs font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded uppercase tracking-wider">{user.apiTier || 'B2B'}</span>
                            </div>

                            <button 
                              onClick={handleGenerateApiKey} 
                              disabled={generatingKey}
                              className="mt-6 flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
                            >
                              {generatingKey ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                              Відкликати поточний та згенерувати новий ключ
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-slate-400 mb-6">У вас ще немає згенерованого ключа доступу.</p>
                            <button 
                              onClick={handleGenerateApiKey} 
                              disabled={generatingKey}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
                            >
                              {generatingKey ? <Loader2 className="animate-spin" size={20} /> : <Terminal size={20} />}
                              Згенерувати API Key
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <h3 className="font-black text-lg">Документація</h3>
                      <div className="bg-[var(--background)] p-4 rounded-2xl border border-[var(--border)]">
                        <div className="flex items-center gap-2 mb-2 font-mono text-sm font-bold">
                          <span className="text-emerald-600">GET</span> /api/v1/b2b/market
                        </div>
                        <p className="text-sm text-slate-500">Отримати ринкову оцінку та останні ціни конкурентів за артикулом.</p>
                      </div>
                      <div className="bg-[var(--background)] p-4 rounded-2xl border border-[var(--border)]">
                        <div className="flex items-center gap-2 mb-2 font-mono text-sm font-bold">
                          <span className="text-emerald-600">GET</span> /api/v1/b2b/deals
                        </div>
                        <p className="text-sm text-slate-500">Потік сирих арбітражних угод зі скраперів (затримка 15 хв).</p>
                      </div>
                      <div className="text-sm text-slate-400 font-medium italic">
                        * Авторизація відбувається через заголовок <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">x-api-key</code>.
                      </div>
                    </div>
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