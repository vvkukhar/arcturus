import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatMoney } from '@/lib/format';

type Props = {
  title: string;
  slug: string;
  price?: number | null;
  condition?: string | null;
  status?: string | null;
  imageUrl?: string | null;
};

export function StoreProductCard({
  title,
  slug,
  price,
  condition,
  status,
  imageUrl,
}: Props) {
  return (
    <Link href={`/store/catalog/${slug}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
        <CardContent>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="mt-4 text-base font-black">{title}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {condition ? <Badge>{condition}</Badge> : null}
            {status ? <Badge>{status}</Badge> : null}
          </div>
          <div className="mt-4 text-lg font-black text-slate-950">
            {formatMoney(price)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}