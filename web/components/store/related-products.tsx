import { StoreProductCard } from '@/components/store/store-product-card';

interface RelatedItem {
  id: string;
  titleSnapshot?: string | null;
  item?: { title?: string | null };
  expectedSalePriceManual?: number | null;
  totalCost?: number | null;
  condition?: string | null;
  quantity?: number | null;
  images?: { isPrimary: boolean; imageUrl: string }[];
}

type Props = {
  items: RelatedItem[];
};

export function RelatedProducts({ items }: Props) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="space-y-6 pt-12 border-t border-slate-200">
      <div className="text-3xl font-black tracking-tight text-slate-900">Схожі позиції</div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const title = item.titleSnapshot || item.item?.title || 'Unknown Product';
          const slug = title.toLowerCase().replaceAll(' ', '-') || item.id;
          const primaryImage = Array.isArray(item.images) && item.images.length > 0
            ? (item.images.find(img => img.isPrimary) ?? item.images[0]).imageUrl
            : null;

          return (
            <StoreProductCard
              key={item.id}
              title={title}
              slug={slug}
              price={item.expectedSalePriceManual ?? item.totalCost}
              condition={item.condition ?? undefined}
              status={(item.quantity ?? 0) > 0 ? 'Available' : 'Sold'}
              imageUrl={primaryImage}
            />
          );
        })}
      </div>
    </section>
  );
}