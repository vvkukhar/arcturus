'use client';

import { useState, useTransition } from 'react';
import { CreditCard, Loader2, MessageSquare, Phone, User } from 'lucide-react';
import { apiFetch } from '@/lib/client-api';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';
import type { ApiResponse } from '@/lib/types';

type Props = {
  inventoryItemId?: string;
  productTitle: string;
};

interface OrderResponse {
  id?: string;
  orders?: { id: string }[];
}

interface CheckoutResponse {
  url: string;
}

export function OrderContactForm({ inventoryItemId, productTitle }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState(t('contactForm.orderText').replace('{title}', productTitle));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setError('Ім\'я та контактні дані є обов\'язковими.');
      return;
    }
    
    startTransition(async () => {
      try {
        setError(null);
        
        const reserveResponse = await apiFetch<ApiResponse<OrderResponse>>('/api/store/contact', {
          method: 'POST',
          body: JSON.stringify({
            inventoryItemId,
            name: name.trim(),
            contact: contact.trim(),
            message: message.trim(),
            productTitle,
          }),
        });

        const data = reserveResponse.data || (reserveResponse as unknown as OrderResponse);
        const orderId = data?.orders?.[0]?.id || data?.id;

        if (!orderId) {
          throw new Error('Failed to generate order ID.');
        }

        const checkoutResponse = await apiFetch<CheckoutResponse>('/api/store/checkout', {
          method: 'POST',
          body: JSON.stringify({ orderId }),
        });

        if (checkoutResponse?.url) {
          window.location.href = checkoutResponse.url;
        } else {
          throw new Error('Payment gateway error. No URL provided.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error during checkout.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}
      
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
          <User className="h-3.5 w-3.5" />
          {t('contactForm.name')}
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
          <Phone className="h-3.5 w-3.5" />
          {t('contactForm.phone')}
        </label>
        <input
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="@username / +380..."
          disabled={isPending}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
          <MessageSquare className="h-3.5 w-3.5" />
          {t('contactForm.message')}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPending}
          className="min-h-[100px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>

      <Button
        type="submit"
        className="w-full py-4 text-base h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/20"
        disabled={isPending || !name.trim() || !contact.trim()}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
        ) : (
          <CreditCard className="mr-2 h-6 w-6 text-white" />
        )}
        {isPending ? t('contactForm.secureConn') : t('contactForm.paySafe')}
      </Button>
    </form>
  );
}