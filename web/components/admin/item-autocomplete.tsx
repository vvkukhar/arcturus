// call:function_1{"queries":["web/components/admin/item-autocomplete.tsx"]}
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { useDebounce } from '@/lib/use-debounce';

type ItemRow = {
  id: string;
  title: string;
  setNumber?: string | null;
  theme?: string | null;
  kind?: string | null;
};

type Props = {
  value: string;
  onChangeAction: (value: string) => void;
  onPickAction?: (item: ItemRow) => void;
  placeholder?: string;
};

export function ItemAutocomplete({ value, onChangeAction, onPickAction, placeholder = 'Search item' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const debouncedValue = useDebounce(value, 300);

  const { data, isLoading } = useSWR<ItemRow[]>(
    debouncedValue.trim() ? `/api/admin/items/search?q=${encodeURIComponent(debouncedValue.trim())}` : null,
    swrFetcher
  );

  const results = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-2 relative">
      <input
        value={value}
        onChange={(e) => {
          onChangeAction(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--border)] px-4 py-3.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-[var(--foreground)] bg-[var(--background)] font-bold shadow-sm"
      />
      {isLoading && <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 absolute -bottom-5 left-1 animate-pulse">Searching catalog...</div>}
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 max-h-64 overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl custom-scrollbar py-2">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPickAction?.(item);
                setIsOpen(false);
              }}
              className="block w-full px-5 py-3 text-left hover:bg-[var(--background)] transition-colors border-b border-[var(--border)] last:border-0 group"
            >
              <div className="font-black text-[var(--foreground)] group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</div>
              <div className="flex items-center gap-2 mt-1.5">
                {item.setNumber && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black font-mono text-slate-500">
                    {item.setNumber}
                  </span>
                )}
                {item.theme && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                    {item.theme}
                  </span>
                )}
                {item.kind === 'minifigure' && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                    Minifigure
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}