// call:function_1{"queries":["web/components/store/make-offer-modal.tsx"]}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Loader2, MessageSquare, Award, TrendingDown } from 'lucide-react';
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

  const discountPercent = amount && Number(amount) < currentPrice 
    ? (((currentPrice - Number(amount)) / currentPrice) * 100).toFixed(1) 
    : null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-[var(--foreground)] overflow-hidden">
        
        {/* Декоративне неонове світіння */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

        {/* Кнопка закриття */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-[var(--background)] hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors z-10">
          <X size={20} />
        </button>

        {/* Шапка */}
        <div className="mb-8 flex items-center gap-4 relative z-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/30 text-white shrink-0">
            <Award size={24} />
          </div>
          <div className="min-w-0 pr-8">
            <h2 className="text-2xl font-black tracking-tight leading-tight">Ваша пропозиція</h2>
            <p className="text-xs font-bold text-slate-500 truncate mt-1">{productTitle}</p>
          </div>
        </div>

        {/* Поточна ціна */}
        <div className="mb-8 p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex justify-between items-center relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-300 dark:bg-slate-700" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2">Поточна ціна</span>
          <span className="text-2xl font-black text-slate-400 line-through decoration-2 decoration-red-500/50">
            {formatMoney(currentPrice)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Поле вводу суми */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1 flex items-center gap-1">
              <TrendingDown size={14} /> Запропонована ціна
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500 font-black text-2xl">₴</span>
              <input
                required
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                placeholder="0"
                className="w-full h-16 pl-12 pr-6 rounded-2xl bg-[var(--background)] border-2 border-[var(--border)] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-black text-2xl outline-none transition-all text-[var(--foreground)] placeholder:text-slate-300 dark:placeholder:text-slate-700"
              />
            </div>
            {discountPercent && (
              <p className="text-xs font-bold text-emerald-500 ml-2 mt-2">
                Ви просите знижку: {discountPercent}%
              </p>
            )}
          </div>

          {/* Поле коментаря */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Коментар для продавця (Опціонально)</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                placeholder="Аргументуйте свою ціну (наприклад: 'Заберу сьогодні самовивозом')..."
                rows={3}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium text-sm outline-none transition-all resize-none custom-scrollbar text-[var(--foreground)]"
              />
            </div>
          </div>

          {/* Кнопка відправки */}
          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={loading || !amount || Number(amount) >= currentPrice} 
              className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-purple-600/20 flex justify-center items-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Award size={24} />}
              Надіслати пропозицію
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}