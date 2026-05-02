import { publicApi } from '@/lib/public-api';
import { StoreProductCard } from '@/components/store/store-product-card';
import { StoreFilters } from '@/components/store/store-filters';
import { StoreSearch } from '@/components/store/store-search';
import { SourceFilterChips } from '@/components/store/source-filter-chips';
import { StoreSort } from '@/components/store/store-sort';

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    theme?: string;
    sort?: string;
    availableOnly?: string;
  }>;
};

export default async function StoreCatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const items = await publicApi.getCatalog<any[]>({
    q: params.q,
    type: params.type,
    theme: params.theme,
    sort: params.sort,
    availableOnly: params.availableOnly === 'true',
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-white p-6">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
          Catalog
        </div>
        <h1 className="mt-3 text-4xl font-black">Browse Inventory</h1>
        <div className="mt-4 space-y-3">
          <StoreSearch />
          <StoreFilters />
          <SourceFilterChips />
          <StoreSort />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const slug =
            (item.titleSnapshot || item.item?.title || '')
              .toLowerCase()
              .replaceAll(' ', '-') || item.id;
          const primaryImage =
            Array.isArray(item.images) && item.images.length > 0
              ? (item.images.find((x: any) => x.isPrimary) ?? item.images[0]).imageUrl
              : null;

          return (
            <StoreProductCard
              key={item.id}
              title={item.titleSnapshot || item.item?.title}
              slug={slug}
              price={item.expectedSalePriceManual ?? item.totalCost}
              condition={item.condition}
              status={item.quantity > 0 ? 'Available' : 'Sold'}
              imageUrl={primaryImage}
            />
          );
        })}
      </div>
    </div>
  );
}