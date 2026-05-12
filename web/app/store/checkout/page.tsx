'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, ArrowRight, ShieldCheck, CreditCard, Loader2, Package } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { formatMoney } from '@/lib/format';
import { apiFetch } from '@/lib/client-api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, removeItem, clearCart, validateStock } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || items.length === 0) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      await validateStock();
      const currentItems = useCart.getState().items;
      
      if (currentItems.length !== items.length) {
        throw new Error('Деякі товари щойно розкупили. Кошик оновлено.');
      }

      const requests = currentItems.map(item => 
        apiFetch<{ id: string }>('/api/store/contact', {
          method: 'POST',
          body: JSON.stringify({
            inventoryItemId: item.id,
            productTitle: item.title,
            name: buyerName.trim(),
            contact: contactInfo.trim(),
            message: `Order from Cart (Qty: ${item.quantity})`
          }),
        })
      );

      const results = await Promise.all(requests);
      const firstOrderId = results[0]?.id;

      clearCart();

      if (firstOrderId) {
        router.replace(`/success?orderId=${firstOrderId}`);
      } else {
        router.replace(`/success?reference=CART_${Date.now()}`);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка при оформленні замовлення. Перевірте з\'єднання та спробуйте ще раз.');
      setIsProcessing(false);
    }
  }, [items, buyerName, contactInfo, isProcessing, clearCart, router, validateStock]);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-3xl font-black text-[var(--foreground)] mb-4">Кошик порожній</h1>
        <p className="text-slate-500 font-medium mb-8">Час знайти круті набори для вашої колекції.</p>
        <button 
          onClick={() => router.push('/store/catalog')} 
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
        >
          Перейти до каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-500 pb-24">
      <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tight mb-10">Оформлення замовлення</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
              <ShieldCheck className="text-blue-500 h-6 w-6" /> Контактні дані
            </h2>
            
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Ім'я та Прізвище</label>
                <input 
                  type="text" 
                  required 
                  value={buyerName} 
                  onChange={(e) => setBuyerName(e.target.value)} 
                  disabled={isProcessing} 
                  className="w-full h-14 px-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold outline-none transition-all disabled:opacity-50" 
                  placeholder="Введіть ваше ім'я" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Телефон або Telegram</label>
                <input 
                  type="text" 
                  required 
                  value={contactInfo} 
                  onChange={(e) => setContactInfo(e.target.value)} 
                  disabled={isProcessing} 
                  className="w-full h-14 px-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold outline-none transition-all disabled:opacity-50" 
                  placeholder="+380... або @username" 
                />
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-sm sticky top-6">
            <h2 className="text-xl font-black mb-6">Ваше замовлення</h2>
            
            <div className="space-y-4 mb-8 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] relative group">
                  <div className="relative h-20 w-20 shrink-0 rounded-[1rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[var(--border)]">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-1 mix-blend-multiply dark:mix-blend-normal" sizes="80px" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden flex flex-col justify-center">
                    <h4 className="font-bold text-[var(--foreground)] truncate leading-tight mb-1">{item.title}</h4>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{item.theme} x{item.quantity}</div>
                    <div className="font-black text-blue-600 dark:text-blue-400">{formatMoney(item.price * item.quantity)}</div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="absolute -top-2 -right-2 p-2.5 bg-red-100 text-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border)] pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">До оплати</span>
                <span className="text-4xl font-black text-[var(--foreground)] tracking-tight">{formatMoney(totalPrice())}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form" 
              disabled={isProcessing} 
              className="w-full flex h-16 items-center justify-center gap-3 rounded-[2rem] bg-[var(--foreground)] text-[var(--background)] text-lg font-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-2xl shadow-black/10 dark:shadow-white/10"
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <CreditCard className="h-6 w-6" /> 
                  Підтвердити 
                  <ArrowRight className="h-5 w-5 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}