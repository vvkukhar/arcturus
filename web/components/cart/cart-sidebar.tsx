'use client';

import { useCart } from '../providers/cart-provider';
import { useI18n } from '../providers/i18n-provider';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, totalPrice } = useCart();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

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
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShoppingBag size={20} />
            {t('cart.title')}
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <ShoppingBag size={40} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{t('cart.empty')}</p>
                <p className="text-sm text-slate-500 mt-1">{t('cart.addItems')}</p>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); router.push('/store/catalog'); }}
                className="mt-4 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                {t('cart.startBrowsing')}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-24 w-24 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="object-contain w-full h-full p-2" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={24}/></div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 justify-between py-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                      <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 p-1">
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-l-lg">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-r-lg">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-extrabold text-slate-900">
                        {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 p-6 bg-slate-50/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-medium">{t('cart.subtotal')}</span>
              <span className="text-2xl font-black text-slate-900">
                {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(totalPrice)}
              </span>
            </div>
            
            <button onClick={handleCheckout} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/20">
              {t('cart.checkoutNow')} <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}