'use client';

import { useState } from 'react';
import { ShoppingCart, Zap, Heart, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { QuickBuyModal } from '@/components/store/quick-buy-modal';
import { useI18n } from '@/components/providers/i18n-provider';

export function AddToCartButton({ product }: { product: any }) {
  const { t } = useI18n();
  const addItem = useCart((state) => state.addItem);
  const cartItems = useCart((state) => state.items);
  const inCart = cartItems.some((i) => i.id === product.id);
  
  const [isWatchloading, setIsWatchLoading] = useState(false);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);

  const handleAddToCart = () => {
    if (!inCart && product.isAvailable && product.price) addItem(product);
  };

  const handleAddToWanted = async () => {
    try {
      setIsWatchLoading(true);
      await apiFetch('/api/proxy/public/wanted', {
        method: 'POST',
        body: JSON.stringify({ itemId: product.itemId || product.id }),
      });
      toast.success(t('product.toast.wanted' as any));
    } catch (err: any) {
      toast.error(err.message || t('common.error' as any));
    } finally {
      setIsWatchLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {product.isAvailable && product.price ? (
        <div className="flex gap-3 w-full">
          <button
            onClick={() => setIsQuickBuyOpen(true)}
            className="flex-1 flex h-16 items-center justify-center gap-2 rounded-[2rem] text-lg font-black transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95"
          >
            <Zap className="h-5 w-5" /> {t('product.btn.1click' as any)}
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={inCart}
            className={`flex-1 flex h-16 items-center justify-center gap-2 rounded-[2rem] text-lg font-black transition-all ${
              inCart
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-[var(--card)] border-2 border-[var(--border)] text-[var(--foreground)] hover:border-blue-500 active:scale-95'
            }`}
          >
            <ShoppingCart className="h-5 w-5" /> {inCart ? t('product.card.inCart' as any) : t('product.addToCart' as any)}
          </button>

          <QuickBuyModal product={product} isOpen={isQuickBuyOpen} onClose={() => setIsQuickBuyOpen(false)} />
        </div>
      ) : (
        <button
          onClick={handleAddToWanted}
          disabled={isWatchloading}
          className="w-full flex h-16 items-center justify-center gap-3 rounded-[2rem] text-lg font-black transition-all bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-rose-500/20 active:scale-95"
        >
          {isWatchloading ? <Loader2 className="animate-spin" size={24} /> : <Heart className="h-6 w-6" />}
          {t('product.btn.wanted' as any)}
        </button>
      )}
    </div>
  );
}