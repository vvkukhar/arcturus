'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex animate-in fade-in zoom-in duration-300 flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
          <CheckCircle2 size={24} />
        </div>
        <div className="text-lg font-black text-emerald-900">Request Sent Successfully</div>
        <div className="mt-2 text-sm font-medium text-emerald-700">
          We will contact you shortly to confirm your reservation.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Contact Method</label>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Telegram / Instagram / Phone"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        />
      </div>
      <Button
        className="w-full py-3.5 text-base"
        disabled={loading || !name || !contact}
        onClick={async () => {
          try {
            setLoading(true);
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
          } finally {
            setLoading(false);
          }
        }}
      >
        <Send className="mr-2 h-4 w-4" />
        {loading ? 'Sending Request...' : 'Send Request'}
      </Button>
    </div>
  );
}