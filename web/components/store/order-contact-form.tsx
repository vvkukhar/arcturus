'use client';

import { useState, useTransition } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/client-api';
import { Button } from '@/components/ui/button';

type Props = {
  inventoryItemId?: string;
  productTitle: string;
};

export function OrderContactForm({ inventoryItemId, productTitle }: Props) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState(`I want to reserve: ${productTitle}`);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="flex animate-in fade-in zoom-in duration-300 flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50/80 backdrop-blur-sm p-8 text-center shadow-inner">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm animate-fade-in-up">
          <CheckCircle2 size={28} strokeWidth={2.5} />
        </div>
        <div className="text-xl font-black text-emerald-900 animate-fade-in-up delay-100">Резерв підтверджено</div>
        <div className="mt-2 text-sm font-medium text-emerald-700 animate-fade-in-up delay-200">
          Ми зв'яжемося з вами найближчим часом для завершення угоди.
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!name || !contact) return;
    
    startTransition(async () => {
      try {
        await apiFetch('/api/store/contact', {
          method: 'POST',
          body: JSON.stringify({
            inventoryItemId,
            name,
            contact,
            message,
            productTitle,
          }),
        });
        setDone(true);
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Ім'я</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Джон Доу"
          disabled={isPending}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Контакт</label>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Telegram / Телефон"
          disabled={isPending}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Повідомлення</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPending}
          className="min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>
      <Button
        className="w-full py-4 text-base h-14 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20"
        disabled={isPending || !name || !contact}
        onClick={handleSubmit}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Send className="mr-2 h-5 w-5" />
        )}
        {isPending ? 'Обробка запиту...' : 'Відправити запит'}
      </Button>
    </div>
  );
}