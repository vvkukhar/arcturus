'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/store/cart';

export function AddToCartButton({ product }: { product: any }) {
  const addItem = useCart((state) => state.addItem);
  const cartItems = useCart((state) => state.items);
  const inCart = cartItems.some((i) => i.id === product.id);

  const handleAddToCart = () => {
    if (!inCart && product.isAvailable && product.price) {
      addItem(product);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={inCart || !product.isAvailable || !product.price}
      className={`w-full flex h-16 items-center justify-center gap-3 rounded-[2rem] text-lg font-black transition-all ${
        (!product.isAvailable || !product.price)
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-900'
          : inCart
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 active:scale-[0.98]'
      }`}
    >
      <ShoppingCart className="h-6 w-6" />
      {!product.isAvailable || !product.price ? 'Unavailable' : inCart ? 'In Cart' : 'Add to Cart'}
    </button>
  );
}