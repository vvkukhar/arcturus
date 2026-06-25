'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { InventoryItem } from '@/lib/types';
import { useCart } from '@/lib/store/cart';
import { useI18n } from '../providers/i18n-provider';
import { X, ShoppingCart, CheckCircle2, ShieldCheck, Package } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { ConversionEngine } from './conversion-engine';

export function ProductModal({ item, isOpen, onCloseAction }: { item: InventoryItem; isOpen: boolean; onCloseAction: () => void }) {
  const { addItem, items } = useCart();
  const { t } = useI18n();
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const price = item.expectedSalePriceManual ?? item.totalCost;
  const imageUrl = item.images?.[0]?.imageUrl;
  const inCart = items.some((i) => i.id === item.id);
  const status = (item.quantity ?? 0) > 0 ? 'Available' : 'Sold';

  const handleAddToCart = () => {
    if (!inCart && status === 'Available') {
      addItem({
        id: item.id,
        title: item.titleSnapshot,
        price,
        imageUrl,
      });
      onCloseAction();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in" onClick={onCloseAction} />
      
      <div className="relative w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] bg-[var(--background)] rounded-2xl lg:rounded-3xl shadow-2xl overflow-y-auto overflow-x-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200 hardware-accelerated">
        <button onClick={onCloseAction} className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 md:p-3 bg-[var(--card)]/80 backdrop-blur text-slate-500 hover:text-[var(--foreground)] rounded-full shadow-sm transition-colors">
          <X className="w-5 h-5 md:w-6 md:h-6"/>
        </button>

        <div className="relative w-full md:w-1/2 bg-[var(--card)] p-6 md:p-8 lg:p-12 flex items-center justify-center min-h-[250px] sm:min-h-[350px] md:min-h-full border-b md:border-b-0 md:border-r border-[var(--border)]">
          {imageUrl ? (
            <Image alt={item.titleSnapshot} className="object-contain mix-blend-multiply dark:mix-blend-normal p-6 md:p-12" fill sizes="(max-width: 768px) 100vw, 50vw" src={imageUrl}/>
          ) : (
            <Package className="text-slate-300 dark:text-slate-700 w-16 h-16 md:w-24 md:h-24"/>
          )}
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 md:px-3 md:py-1.5 bg-[var(--card)] border border-[var(--border)] text-slate-600 dark:text-slate-300 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-md">
              {item.condition === 'used' ? t('product.card.used' as any) : item.condition}
            </span>
            {item.sealed && (
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-md">
                {t('product.card.new' as any)}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--foreground)] leading-tight mb-2">
            {item.titleSnapshot}
          </h2>
          
          {item.itemId && <p className="text-xs md:text-sm text-slate-500 font-medium mb-4 md:mb-6 font-mono tracking-widest uppercase">{t('product.card.art' as any)}: {item.itemId}</p>}

          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--foreground)]">
            {formatMoney(price)}
          </div>

          <ConversionEngine itemId={item.id}/>

          <div className="space-y-3 mb-6 md:mb-8 mt-2">
            <div className="flex items-center gap-4 text-base text-[var(--foreground)] font-bold">
              <CheckCircle2 className="text-emerald-500 shrink-0 w-5 h-5 md:w-6 md:h-6"/>
              {t('product.inStock' as any)}
            </div>
            <div className="flex items-center gap-4 text-base text-[var(--foreground)] font-bold">
              <ShieldCheck className="text-blue-500 shrink-0 w-5 h-5 md:w-6 md:h-6"/>
              {t('product.authentic' as any)}
            </div>
          </div>

          <div className="mt-auto pt-4 md:pt-0">
            <button 
              onClick={handleAddToCart}
              disabled={inCart || status !== 'Available'}
              className={`w-full py-4 md:py-5 rounded-xl lg:rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-3 transition-all ${
                inCart || status !== 'Available'
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-600/30'
              }`}
            >
              <ShoppingCart size={24}/>
              {status !== 'Available' ? t('product.card.sold' as any) : inCart ? t('product.card.inCart' as any) : t('product.addToCart' as any)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}