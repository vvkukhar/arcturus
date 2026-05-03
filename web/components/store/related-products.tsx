import { StoreProductCard } from '@/components/store/store-product-card';

type Props = {
  items: Array<{
    id: string;
    titleSnapshot?: string | null;
    item?: {
      title?: string | null;
    };
    expectedSalePriceManual?: number | null;
    totalCost?: number | null;
    condition?: string | null;
    quantity?: number | null;
  }>;
};

export function RelatedProducts({ items }: Props) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="text-3xl font-black tracking-tight text-slate-900">Related Products</div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const title = item.titleSnapshot || item.item?.title || 'Product';
          const slug = title.toLowerCase().replaceAll(' ', '-');
          return (
            <StoreProductCard
              key={item.id}
              title={title}
              slug={slug}
              price={item.expectedSalePriceManual ?? item.totalCost}
              condition={item.condition ?? undefined}
              status={(item.quantity ?? 0) > 0 ? 'Available' : 'Sold'}
            />
          );
        })}
      </div>
    </section>
  );
}