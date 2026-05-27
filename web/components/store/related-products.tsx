import { ProductCard } from '@/components/store/store-product-card';
import { useI18n } from '@/components/providers/i18n-provider';

interface RelatedItem {
  id: string;
  titleSnapshot?: string | null;
  item?: { title?: string | null; theme?: string | null; kind?: string | null; setNumber?: string | null };
  expectedSalePriceManual?: number | null;
  purchasePrice?: number | null;
  totalCost?: number | null;
  condition?: string | null;
  quantity?: number | null;
  sealed?: boolean | null;
  images?: { isPrimary: boolean; imageUrl: string }[];
}

type Props = {
  items: RelatedItem[];
};

export function RelatedProducts({ items }: Props) {
  const { t } = useI18n();

  if (!items.length) {
    return null;
  }

  return (
    <section className="space-y-6 pt-12 border-t border-[var(--border)]">
      <div className="text-3xl font-black tracking-tight text-[var(--foreground)]">
        {t('related.title' as any)}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const safeTitle = item.titleSnapshot || item.item?.title || 'Unknown Product';
          
          const baseSlug = String(safeTitle)
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s-]+/gu, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
          
          const safeSlug = `${baseSlug}--${item.id}`;
          
          const normalizedImages = item.images && item.images.length > 0 
            ? item.images 
            : [];

          return (
            <ProductCard
              key={item.id}
              item={{
                ...item,
                title: safeTitle,
                theme: item.item?.theme || 'LEGO',
                sellPrice: item.expectedSalePriceManual ?? item.totalCost ?? item.purchasePrice ?? 0,
                slug: safeSlug,
                images: normalizedImages,
                condition: item.condition ?? 'used',
              }}
            />
          );
        })}
      </div>
    </section>
  );
}