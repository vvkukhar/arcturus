import { publicApi } from '@/lib/public-api';
import { StoreProductCard } from '@/components/store/store-product-card';
import { StoreFilters } from '@/components/store/store-filters';
import { StoreSearch } from '@/components/store/store-search';
import { SourceFilterChips } from '@/components/store/source-filter-chips';
import { StoreSort } from '@/components/store/store-sort';
import { EmptyState } from '@/components/ui/empty-state';

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    theme?: string;
    sort?: string;
    availableOnly?: string;
  }>;
};

interface CatalogItem {
  id: string;
  titleSnapshot?: string;
  item?: { title?: string };
  expectedSalePriceManual?: number;
  totalCost?: number;
  condition?: string;
  quantity: number;
  images?: { isPrimary?: boolean; imageUrl: string }[];
}

export const revalidate = 60;

export default async function StoreCatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  
  let items: CatalogItem[] = [];
  try {
    items = await publicApi.getCatalog<CatalogItem[]>({
      q: params.q,
      type: params.type,
      theme: params.theme,
      sort: params.sort,
      availableOnly: params.availableOnly === 'true',
    });
  } catch (error) {
    items = [];
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
          Catalog
        </div>
        <h1 className="mt-3 text-4xl font-black text-slate-900">Browse Inventory</h1>
        <div className="mt-6 space-y-4">
          <StoreSearch />
          <StoreFilters />
          <SourceFilterChips />
          <StoreSort />
        </div>
      </div>
      
      {items.length === 0 ? (
        <EmptyState title="Нічого не знайдено" description="Спробуйте змінити критерії пошуку або фільтри." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const title = item.titleSnapshot || item.item?.title || 'Unknown Product';
            const slug = title.toLowerCase().replaceAll(' ', '-') || item.id;
            const primaryImage =
              Array.isArray(item.images) && item.images.length > 0
                ? (item.images.find((x) => x.isPrimary) ?? item.images[0]).imageUrl
                : null;

            return (
              <StoreProductCard
                key={item.id}
                title={title}
                slug={slug}
                price={item.expectedSalePriceManual ?? item.totalCost}
                condition={item.condition}
                status={item.quantity > 0 ? 'Available' : 'Sold'}
                imageUrl={primaryImage}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}