import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';

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
    <Link href={`/store/catalog/${slug}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-glow">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 p-2">
          <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-white">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-semibold text-slate-400">
                No Image
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex-1">
            <h3 className="line-clamp-2 text-lg font-black leading-tight text-slate-900">
              {title}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {condition ? (
                <Badge className="border-transparent bg-slate-100 text-slate-600 shadow-none">
                  {condition}
                </Badge>
              ) : null}
              {status ? (
                <Badge
                  className={cn(
                    'border-transparent shadow-none',
                    status.toLowerCase() === 'available'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {status}
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div className="text-2xl font-black tracking-tight text-slate-900">
              {formatMoney(price)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}