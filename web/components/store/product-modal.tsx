'use client';

import { InventoryItem } from '@/lib/types';
import { useCart } from '../providers/cart-provider';
import { useI18n } from '../providers/i18n-provider';
import { X, ShoppingCart, CheckCircle2, ShieldCheck, Package } from 'lucide-react';
import { useEffect } from 'react';

export function ProductModal({ item, isOpen, onClose }: { item: InventoryItem; isOpen: boolean; onClose: () => void }) {
  const { addItem } = useCart();
  const { t } = useI18n();
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const price = item.expectedSalePriceManual ?? item.totalCost;
  const imageUrl = item.images?.[0]?.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] bg-white dark:bg-slate-950 rounded-2xl lg:rounded-3xl shadow-2xl overflow-y-auto overflow-x-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 md:p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full shadow-sm">
          <X size={20} className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 p-6 md:p-8 lg:p-12 flex items-center justify-center min-h-[250px] sm:min-h-[350px] md:min-h-full">
          {imageUrl ? (
            <img src={imageUrl} alt={item.titleSnapshot} className="w-full h-full max-h-[300px] md:max-h-[500px] object-contain mix-blend-multiply dark:mix-blend-normal" />
          ) : (
            <Package size={64} className="text-slate-300 dark:text-slate-700 w-16 h-16 md:w-24 md:h-24" />
          )}
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 md:px-3 md:py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-md">
              {item.condition}
            </span>
            {item.sealed && (
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-md">
                Sealed
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-2">
            {item.titleSnapshot}
          </h2>
          
          {item.itemId && <p className="text-xs md:text-sm text-slate-500 font-medium mb-4 md:mb-6">ID: {item.itemId}</p>}

          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 md:mb-8">
            {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(price)}
          </div>

          <div className="space-y-3 mb-6 md:mb-8">
            <div className="flex items-center gap-3 text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium">
              <CheckCircle2 size={18} className="text-green-500 shrink-0 w-5 h-5 md:w-6 md:h-6" />
              {t('product.inStock')}
            </div>
            <div className="flex items-center gap-3 text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium">
              <ShieldCheck size={18} className="text-blue-500 shrink-0 w-5 h-5 md:w-6 md:h-6" />
              {t('product.authentic')}
            </div>
          </div>

          <div className="mt-auto pt-4 md:pt-0">
            <button 
              onClick={() => {
                addItem({ id: item.id, title: item.titleSnapshot, price, imageUrl });
                onClose();
              }}
              className="w-full py-4 md:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl lg:rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/30"
            >
              <ShoppingCart size={20} className="w-5 h-5 md:w-6 md:h-6" />
              {t('product.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}