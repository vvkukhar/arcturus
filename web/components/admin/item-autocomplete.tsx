'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { useDebounce } from '@/lib/use-debounce';

type ItemRow = {
  id: string;
  title: string;
  setNumber?: string | null;
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
        className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-[var(--foreground)] bg-[var(--background)]"
      />
      {isLoading && <div className="text-xs font-bold text-slate-500 absolute -bottom-6 left-0">Searching...</div>}
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-56 overflow-auto rounded-2xl border border-border bg-[var(--card)] shadow-xl custom-scrollbar">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPickAction?.(item);
                setIsOpen(false);
              }}
              className="block w-full border-b border-border px-4 py-3 text-left text-sm hover:bg-[var(--background)] last:border-b-0 transition-colors"
            >
              <div className="font-bold text-[var(--foreground)]">{item.title}</div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">{item.setNumber ?? item.id}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}