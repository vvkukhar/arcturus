'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const themes = ['Ninjago', 'Star Wars', 'Harry Potter', 'Marvel', 'Minecraft'];

export function SourceFilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTheme = searchParams.get('theme') ?? '';

  const update = (theme: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (theme) {
      params.set('theme', theme);
    } else {
      params.delete('theme');
    }

    router.push(`/store/catalog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => update(null)}
        className={`rounded-full border px-3 py-2 text-sm ${
          currentTheme === '' ? 'bg-slate-900 text-white' : 'bg-white'
        }`}
      >
        All Themes
      </button>
      {themes.map((theme) => (
        <button
          key={theme}
          onClick={() => update(theme)}
          className={`rounded-full border px-3 py-2 text-sm ${
            currentTheme === theme ? 'bg-slate-900 text-white' : 'bg-white'
          }`}
        >
          {theme}
        </button>
      ))}
    </div>
  );
}