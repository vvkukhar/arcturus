// call:function_1{"queries":["web/components/store/make-offer-modal.tsx"]}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Loader2, MessageSquare, Award } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { formatMoney } from '@/lib/format';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItemId: string;
  productTitle: string;
  currentPrice: number;
}

export function MakeOfferModal({ isOpen, onClose, inventoryItemId, productTitle, currentPrice }: MakeOfferModalProps) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Будь ласка, введіть коректну суму');
      return;
    }

    if (parsedAmount >= currentPrice) {
      toast.error('Сума пропозиції має бути меншою за поточну ціну товару');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/api/proxy/offers', {
        method: 'POST',
        body: JSON.stringify({
          inventoryItemId,
          amount: parsedAmount,
          message: message.trim() || undefined,
        }),
      });

      toast.success('Вашу пропозицію успішно надіслано продавцю!');
      setAmount('');
      setMessage('');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Не вдалося надіслати пропозицію');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-[var(--foreground)]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-[var(--background)] rounded-full text-slate-400 transition-colors">
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md text-white">
            <Award size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Запропонувати ціну</h2>
            <p className="text-xs font-medium text-slate-500 truncate max-w-[280px]">{productTitle}</p>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex justify-between items-center text-sm font-bold">
          <span className="text-slate-500">Поточна ціна:</span>
          <span className="text-slate-900 dark:text-white font-black">{formatMoney(currentPrice)}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Ваша ціна (UAH)</label>
            <div className="relative">
              {/* ФІКС: Знак гривні замість долара */}
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">₴</span>
              <input
                required
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                placeholder="0.00"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-bold outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Коментар для продавця (Опціонально)</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                placeholder="Наприклад: Готовий забрати сьогодні ж через НП..."
                rows={3}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium outline-none transition-all resize-none custom-scrollbar"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading || !amount} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xl shadow-indigo-600/20 flex justify-center items-center gap-2">
              {loading && <Loader2 className="animate-spin" size={18} />}
              Надіслати пропозицію
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}