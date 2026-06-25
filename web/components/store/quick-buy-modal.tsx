'use client';

import { useState } from 'react';
import { Zap, X, Loader2, CreditCard } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { NovaPoshtaPicker } from '@/components/checkout/nova-poshta-picker';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/components/providers/i18n-provider';

export function QuickBuyModal({ product, isOpen, onClose }: { product: any; isOpen: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const router = useRouter();
  const [buyerName, setBuyerName] = useState('');
  const [contact, setContact] = useState('');
  const [city, setCity] = useState('');
  const [branch, setBranch] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = buyerName.trim() && contact.trim() && city.trim() && branch.trim();

  const handleQuickBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    try {
      const reserveRes = await apiFetch<any>('/api/store/contact', {
        method: 'POST',
        body: JSON.stringify({
          inventoryItemId: product.id,
          productTitle: product.title,
          name: buyerName.trim(),
          contact: contact.trim(),
          message: `1-Click Buy. Delivery: ${city}, ${branch}`,
          quantity: 1
        }),
      });

      const orderId = reserveRes.data?.orders?.[0]?.id || reserveRes.data?.id;

      if (!orderId) throw new Error('Order creation failed');

      const checkoutRes = await apiFetch<any>('/api/store/checkout', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
      });

      if (checkoutRes?.url) {
        window.location.href = checkoutRes.url;
      } else {
        router.push(`/success?orderId=${orderId}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment processing failed');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--card)] rounded-[2.5rem] border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px]" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-2">
              <Zap className="text-blue-500" /> 1-Click Buy
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-1 truncate max-w-[280px]">{product.title}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-[var(--background)] rounded-full text-slate-500 relative z-10">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="flex justify-between items-center bg-[var(--background)] p-4 rounded-2xl border border-[var(--border)] mb-6">
            <span className="font-bold text-sm uppercase text-slate-500 tracking-widest">{t('checkout.total' as any)}</span>
            <span className="font-black text-2xl text-[var(--foreground)]">{formatMoney(product.price)}</span>
          </div>

          <form id="quick-buy-form" onSubmit={handleQuickBuy} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('checkout.firstName' as any)}</label>
              <input required value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="ПІБ" className="w-full h-14 px-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] font-bold outline-none focus:border-blue-500 text-[var(--foreground)]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('checkout.phone' as any)}</label>
              <input required value={contact} onChange={e => setContact(e.target.value)} placeholder="+380..." className="w-full h-14 px-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] font-bold outline-none focus:border-blue-500 text-[var(--foreground)]" />
            </div>
            <NovaPoshtaPicker onCitySelect={setCity} onWarehouseSelect={setBranch} />
          </form>
        </div>

        <div className="p-6 border-t border-[var(--border)] bg-[var(--background)]/50">
          <button form="quick-buy-form" type="submit" disabled={!isFormValid || loading} className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <CreditCard />}
            {t('contactForm.paySafe' as any)} {formatMoney(product.price)}
          </button>
        </div>
      </div>
    </div>
  );
}