'use client';

import Image from 'next/image';
import { useCart } from '../providers/cart-provider';
import { useI18n } from '../providers/i18n-provider';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatMoney } from '@/lib/format';

export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, totalPrice } = useCart();
  const { t } = useI18n();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  if (!mounted || !isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/store/checkout');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />
      
      <div className="relative w-full max-w-md bg-[var(--background)] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--card)]">
          <h2 className="text-xl font-extrabold text-[var(--foreground)] flex items-center gap-2">
            <ShoppingBag size={20} />
            {(t('cart.title' as any) as string)}
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:bg-[var(--background)] hover:text-[var(--foreground)] rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[var(--background)]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-24 w-24 bg-[var(--card)] rounded-full flex items-center justify-center text-slate-300 border border-[var(--border)]">
                <ShoppingBag size={40} />
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--foreground)]">{(t('cart.empty' as any) as string)}</p>
                <p className="text-sm text-slate-500 mt-1">{(t('cart.addItems' as any) as string)}</p>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); router.push('/store/catalog'); }}
                className="mt-4 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
              >
                {(t('cart.startBrowsing' as any) as string)}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm group">
                  <div className="h-20 w-20 flex-shrink-0 bg-[var(--background)] rounded-xl overflow-hidden border border-[var(--border)] relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.title} fill sizes="80px" className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={24}/></div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 justify-between py-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold text-[var(--foreground)] line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                      <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 p-1 transition-colors opacity-0 group-hover:opacity-100">
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-center border border-[var(--border)] rounded-lg bg-[var(--background)]">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-slate-500 hover:text-[var(--foreground)] rounded-l-lg transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[var(--foreground)]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-slate-500 hover:text-[var(--foreground)] rounded-r-lg transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-black text-[var(--foreground)]">
                        {formatMoney(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--border)] p-6 bg-[var(--card)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-medium text-sm">{(t('cart.subtotal' as any) as string)}</span>
              <span className="text-2xl font-black text-[var(--foreground)]">
                {formatMoney(totalPrice)}
              </span>
            </div>
            
            <button onClick={handleCheckout} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-600/20">
              {(t('cart.checkoutNow' as any) as string)} <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}