'use client';

import { useEffect, useState } from 'react';

type ItemRow = {
  id: string;
  title: string;
  setNumber?: string | null;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onPick?: (item: ItemRow) => void;
  placeholder?: string;
};

export function ItemAutocomplete({ value, onChange, onPick, placeholder = 'Search item' }: Props) {
  const [results, setResults] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const trimmed = value.trim();

    if (!trimmed) {
      setResults([]);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/items/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        
        if (!response.ok) {
          setResults([]);
          return;
        }
        
        const json = await response.json();
        setResults(Array.isArray(json) ? json : []);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(run, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border px-4 py-3 text-sm"
      />
      {loading && <div className="text-xs text-slate-500">Searching...</div>}
      {results.length > 0 && (
        <div className="max-h-56 overflow-auto rounded-2xl border border-border bg-white shadow-lg">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPick?.(item);
                setResults([]);
              }}
              className="block w-full border-b border-border px-4 py-3 text-left text-sm hover:bg-slate-50 last:border-b-0"
            >
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-slate-500">{item.setNumber ?? item.id}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}