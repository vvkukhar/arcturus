'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function StoreSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select
      value={searchParams.get('sort') ?? ''}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        const value = e.target.value;

        if (value) {
          params.set('sort', value);
        } else {
          params.delete('sort');
        }

        router.push(`/store/catalog?${params.toString()}`);
      }}
      className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold"
    >
      <option value="">Newest</option>
      <option value="price_asc">Price Asc</option>
      <option value="price_desc">Price Desc</option>
      <option value="title_asc">Title A-Z</option>
    </select>
  );
}