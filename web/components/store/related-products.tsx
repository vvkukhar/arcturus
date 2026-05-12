import { StoreProductCard } from '@/components/store/store-product-card';
import { useI18n } from '@/components/providers/i18n-provider';

interface RelatedItem {
  id: string;
  titleSnapshot?: string | null;
  item?: { title?: string | null; theme?: string | null; kind?: string | null; setNumber?: string | null };
  expectedSalePriceManual?: number | null;
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
      <div className="text-3xl font-black tracking-tight text-[var(--foreground)]">{t('related.title' as any)}</div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <StoreProductCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}