'use client';

import { useState, useTransition } from 'react';
import { Send, Loader2, CreditCard } from 'lucide-react';
import { apiFetch } from '@/lib/client-api';
import { Button } from '@/components/ui/button';

type Props = {
  inventoryItemId?: string;
  productTitle: string;
};

export function OrderContactForm({ inventoryItemId, productTitle }: Props) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState(`Оформлюю замовлення: ${productTitle}`);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!name || !contact) return;
    
    startTransition(async () => {
      try {
        setError(null);
        
        const reserveResponse = await apiFetch<any>('/api/store/contact', {
          method: 'POST',
          body: JSON.stringify({
            inventoryItemId,
            name,
            contact,
            message,
            productTitle,
          }),
        });

        const orderId = reserveResponse?.orders?.[0]?.id || reserveResponse?.id; 

        if (!orderId) {
          throw new Error('Не вдалося створити замовлення. Спробуйте ще раз.');
        }

        const checkoutResponse = await apiFetch<any>('/api/store/checkout', {
          method: 'POST',
          body: JSON.stringify({ orderId }),
        });

        if (checkoutResponse?.url) {
          window.location.href = checkoutResponse.url;
        } else {
          throw new Error('Помилка ініціалізації платіжного шлюзу.');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Сталася невідома помилка');
      }
    });
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Ваше Ім'я</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Джон Доу"
          disabled={isPending}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Контакт (Telegram / Телефон)</label>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="@username або +380..."
          disabled={isPending}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Додаткові побажання</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPending}
          className="min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>
      <Button
        className="w-full py-4 text-base h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/20"
        disabled={isPending || !name || !contact}
        onClick={handleSubmit}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
        ) : (
          <CreditCard className="mr-2 h-6 w-6 text-white" />
        )}
        {isPending ? 'Захищене з\'єднання...' : 'Оплатити безпечно'}
      </Button>
    </div>
  );
}