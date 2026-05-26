'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export function AddToCartButton({ product }: { product: any }) {
  const addItem = useCart((state) => state.addItem);
  const cartItems = useCart((state) => state.items);
  const inCart = cartItems.some((i) => i.id === product.id);
  const [isWatchloading, setIsWatchLoading] = useState(false);

  const handleAddToCart = () => {
    if (!inCart && product.isAvailable && product.price) {
      addItem(product);
    }
  };

  const handleAddToWanted = async () => {
    try {
      setIsWatchLoading(true);
      await apiFetch('/api/proxy/public/wanted', {
        method: 'POST',
        body: JSON.stringify({ itemId: product.itemId || product.id }),
      });
      toast.success('Набір додано у ваш Wanted List! Ми повідомимо про появу лота.');
    } catch (err: any) {
      toast.error(err.message || 'Помилка додавання у список бажаного');
    } finally {
      setIsWatchLoading(false);
    }
  };

  return (
    <div className="flex gap-4 w-full">
      <button
        onClick={handleAddToCart}
        disabled={inCart || !product.isAvailable || !product.price}
        className={`flex-1 flex h-16 items-center justify-center gap-3 rounded-[2rem] text-lg font-black transition-all ${
          (!product.isAvailable || !product.price)
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-900 hidden'
            : inCart
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 active:scale-[0.98]'
        }`}
      >
        <ShoppingCart className="h-6 w-6" />
        {inCart ? 'У кошику' : 'У кошик'}
      </button>

      {(!product.isAvailable || !product.price) && (
        <button
          onClick={handleAddToWanted}
          disabled={isWatchloading}
          className="w-full flex h-16 items-center justify-center gap-3 rounded-[2rem] text-lg font-black transition-all bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-rose-500/20 active:scale-[0.98]"
        >
          {isWatchloading ? <Loader2 className="animate-spin" size={24} /> : <Heart className="h-6 w-6" />}
          Додати в Wanted List
        </button>
      )}
    </div>
  );
}