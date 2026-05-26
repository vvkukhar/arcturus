'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Zap, Loader2, TrendingUp, CreditCard } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItemId: string;
  productTitle: string;
}

export function BoostModal({ isOpen, onClose, inventoryItemId, productTitle }: BoostModalProps) {
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number>(1);

  if (!isOpen) return null;

  const handleBoost = async () => {
    setLoading(true);
    try {
      await apiFetch('/api/proxy/monetization/boost', {
        method: 'POST',
        body: JSON.stringify({ inventoryItemId, days: duration }),
      });
      toast.success('Listing boosted successfully! Traffic increased.');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply boost');
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (days: number) => {
    if (days === 1) return 150;
    if (days === 3) return 390;
    if (days === 7) return 790;
    return 150;
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-[var(--background)] hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20 text-white">
            <Zap size={24} className="fill-current" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Boost Listing</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1 truncate max-w-[200px]">{productTitle}</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {[1, 3, 7].map((days) => (
            <div 
              key={days}
              onClick={() => setDuration(days)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${duration === days ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-[var(--border)] bg-[var(--background)] hover:border-amber-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${duration === days ? 'border-amber-500' : 'border-slate-300'}`}>
                  {duration === days && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                </div>
                <div>
                  <div className={`font-black ${duration === days ? 'text-amber-700 dark:text-amber-400' : 'text-[var(--foreground)]'}`}>
                    {days} {days === 1 ? 'Day' : 'Days'} VIP
                  </div>
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                    <TrendingUp size={12} /> ~{days * 3}x more views
                  </div>
                </div>
              </div>
              <div className="text-xl font-black text-[var(--foreground)]">
                {getPrice(days)} в‚ґ
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={handleBoost} 
          disabled={loading} 
          className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
          Pay {getPrice(duration)} в‚ґ
        </Button>
      </div>
    </div>
  );
}