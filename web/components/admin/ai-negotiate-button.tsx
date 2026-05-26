'use client';

import { useState } from 'react';
import { Bot, Copy, Check, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = {
  title: string;
  currentPrice: number;
  targetPrice: number;
  condition?: string;
};

export function AiNegotiateButton({ title, currentPrice, targetPrice, condition = 'used' }: Props) {
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (script) return; // Вже згенеровано
    setLoading(true);
    try {
      const data = await apiFetch<any>('/api/ai/negotiate', {
        method: 'POST',
        body: JSON.stringify({ title, currentPrice, targetPrice, condition }),
      });
      setScript(data.script);
    } catch (e) {
      setScript('Не вдалося згенерувати скрипт. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (script) {
      navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          onClick={handleGenerate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors border border-indigo-200"
        >
          <Bot size={14} /> AI Pitch
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="flex items-center gap-2 mb-3 text-indigo-600 font-black text-sm uppercase tracking-wider">
          <Bot size={16} /> Negotiation Script
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate-400">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-xs font-bold">Arcturus AI думає...</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] font-medium leading-relaxed">
              {script}
            </div>
            <button 
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-lg text-xs font-bold hover:scale-[1.02] transition-transform active:scale-95"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />} 
              {copied ? 'Скопійовано!' : 'Копіювати текст'}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}