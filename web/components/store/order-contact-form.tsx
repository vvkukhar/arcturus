'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/client-api';

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
      <div className="rounded-2xl border border-border bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
        Request sent.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-xl border border-border px-4 py-3 text-sm"
      />
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Telegram / Instagram / Email"
        className="w-full rounded-xl border border-border px-4 py-3 text-sm"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-32 w-full rounded-xl border border-border px-4 py-3 text-sm"
      />
      <button
        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
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
        {loading ? 'Sending...' : 'Send Request'}
      </button>
    </div>
  );
}