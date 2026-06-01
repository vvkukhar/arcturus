'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Button } from '@/components/ui/button';
import { X, Loader2, Truck, CreditCard, ShieldCheck, Box } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { formatMoney } from '@/lib/format';
import { NovaPoshtaPicker } from '@/components/checkout/nova-poshta-picker';

interface DropshipCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    wholesalePrice: number;
  };
}

export function DropshipCheckoutModal({ isOpen, onClose, item }: DropshipCheckoutModalProps) {
  const { data: vaultBalance, mutate: mutateVault } = useSWR('/api/proxy/vault/balance', swrFetcher);
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'vault' | 'card'>('vault');
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [city, setCity] = useState('');
  const [branch, setBranch] = useState('');

  if (!isOpen) return null;

  const canUseVault = (vaultBalance || 0) >= item.wholesalePrice;
  const isFormValid = customerName.trim() && contact.trim() && city.trim() && branch.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    try {
      const res = await apiFetch<any>('/api/proxy/dropship/order', {
        method: 'POST',
        body: JSON.stringify({
          inventoryItemId: item.id,
          customerName,
          contact,
          deliveryString: `${city}, ${branch}`,
          paymentMethod
        })
      });

      if (paymentMethod === 'card' && res.url) {
        window.location.href = res.url;
      } else {
        toast.success('Замовлення успішно створено та оплачено!');
        mutateVault();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || 'Помилка створення замовлення');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-[var(--background)] hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors z-10">
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center gap-4 border-b border-[var(--border)] pb-6 shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm shrink-0">
            <Truck size={28} />
          </div>
          <div className="min-w-0 pr-10">
            <h2 className="text-2xl font-black tracking-tight leading-tight">Відправка клієнту</h2>
            <p className="text-xs font-bold text-slate-500 truncate mt-1">{item.title}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">До сплати за оптом</div>
              <div className="text-3xl font-black text-[var(--foreground)]">{formatMoney(item.wholesalePrice)}</div>
            </div>
            <Box className="text-indigo-300 dark:text-indigo-800 w-12 h-12" />
          </div>

          <form id="dropship-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-black text-lg flex items-center gap-2"><ShieldCheck className="text-blue-500" size={18}/> Дані вашого клієнта</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">ПІБ Клієнта</label>
                  <input required value={customerName} onChange={(e) => setCustomerName(e.target.value)} disabled={loading} className="w-full h-14 px-5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-indigo-500 outline-none font-bold text-[var(--foreground)]" placeholder="Іванов Іван" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Телефон Клієнта</label>
                  <input required value={contact} onChange={(e) => setContact(e.target.value)} disabled={loading} className="w-full h-14 px-5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-indigo-500 outline-none font-bold text-[var(--foreground)]" placeholder="+380..." />
                </div>
              </div>
              <NovaPoshtaPicker onCitySelect={setCity} onWarehouseSelect={setBranch} />
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              <h3 className="font-black text-lg">Метод Оплати</h3>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => canUseVault && setPaymentMethod('vault')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'vault' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-[var(--border)] hover:border-indigo-300'} ${!canUseVault && 'opacity-50 cursor-not-allowed'}`}
                >
                  <div className="font-black text-[var(--foreground)] flex justify-between items-center mb-1">
                    Vault Баланс
                    {paymentMethod === 'vault' && <div className="w-3 h-3 bg-indigo-500 rounded-full" />}
                  </div>
                  <div className={`text-xs font-bold ${canUseVault ? 'text-slate-500' : 'text-red-500'}`}>Доступно: {formatMoney(vaultBalance)}</div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-[var(--border)] hover:border-indigo-300'}`}
                >
                  <div className="font-black text-[var(--foreground)] flex justify-between items-center mb-1">
                    Картка / Apple Pay
                    {paymentMethod === 'card' && <div className="w-3 h-3 bg-indigo-500 rounded-full" />}
                  </div>
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1"><CreditCard size={12}/> Monobank Acquiring</div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="pt-6 border-t border-[var(--border)] shrink-0">
          <Button 
            type="submit" 
            form="dropship-form" 
            disabled={loading || !isFormValid} 
            className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Truck size={24} />}
            Сплатити та Відправити
          </Button>
        </div>
      </div>
    </div>
  );
}