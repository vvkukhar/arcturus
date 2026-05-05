'use client';

import { useCart } from '@/components/providers/cart-provider';
import { Package, ShieldCheck, MapPin, CreditCard, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/client-api';
import type { ApiResponse } from '@/lib/types';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    novaPoshta: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const message = `Cart Checkout. Delivery: ${formData.city}, NP: ${formData.novaPoshta}. Items: ${items.map(i => `${i.title} (x${i.quantity})`).join(', ')}`;
      const name = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      
      const reserveResponse = await apiFetch<ApiResponse<any>>('/api/store/contact', {
        method: 'POST',
        body: JSON.stringify({
          inventoryItemId: items[0].id, 
          productTitle: items.length > 1 ? `Multi-item Order (${items.length} sets)` : items[0].title,
          name,
          contact: formData.phone,
          message,
        }),
      });

      const data = reserveResponse.data || reserveResponse;
      const orderId = data?.orders?.[0]?.id || data?.id;

      if (!orderId) {
        throw new Error('Failed to generate order ID from server.');
      }

      const checkoutResponse = await apiFetch<{ url: string }>('/api/store/checkout', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
      });

      clearCart();
      
      if (checkoutResponse?.url) {
        window.location.href = checkoutResponse.url;
      } else {
        router.push('/success?orderId=' + orderId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 md:py-32 text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <Package size={40} className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">Your cart is empty</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-8">Add some items before proceeding to checkout.</p>
        <Link href="/store/catalog" className="inline-flex px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 md:mb-8">Checkout</h1>
      
      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 w-full">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6 md:space-y-8">
            <div className="bg-white dark:bg-slate-950 p-5 sm:p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-600" /> Contact Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white text-sm md:text-base transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white text-sm md:text-base transition-shadow" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+380" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white text-sm md:text-base transition-shadow" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 p-5 sm:p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" /> Delivery (Nova Poshta)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">City</label>
                  <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white text-sm md:text-base transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Branch Number</label>
                  <input required name="novaPoshta" value={formData.novaPoshta} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white text-sm md:text-base transition-shadow" />
                </div>
              </div>
            </div>

            <div className="lg:hidden">
              <button 
                form="checkout-form"
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />} 
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-[400px] xl:w-[450px]">
          <div className="bg-slate-50 dark:bg-slate-900 p-5 sm:p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 lg:sticky lg:top-24">
            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-4 md:mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-[30vh] lg:max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-950 rounded-lg p-1 border border-slate-200 dark:border-slate-800 flex-shrink-0">
                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" alt=""/> : <Package className="w-full h-full text-slate-300 dark:text-slate-700 p-2"/>}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">{item.title}</h4>
                    <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Qty: {item.quantity} × {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-4 md:mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">Subtotal</span>
                <span className="text-sm md:text-base font-bold text-slate-900 dark:text-white">{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">Delivery</span>
                <span className="text-sm md:text-base font-bold text-slate-900 dark:text-white">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 md:mb-8">
              <span className="text-base md:text-lg font-black text-slate-900 dark:text-white">Total</span>
              <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(totalPrice)}</span>
            </div>

            <div className="hidden lg:block">
              <button 
                form="checkout-form"
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-600/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />} 
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4 font-medium">Payments processed securely via Monobank.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}