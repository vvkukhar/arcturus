import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { SpotlightCard } from '@/components/store/spotlight-card';
import { TiltCard } from '@/components/store/tilt-card';

type Props = {
  title: string;
  slug: string;
  price?: number | null;
  condition?: string | null;
  status?: string | null;
  imageUrl?: string | null;
};

export function StoreProductCard({ title, slug, price, condition, status, imageUrl }: Props) {
  return (
    <TiltCard>
      <Link href={`/store/catalog/${slug}`} className="group block h-full outline-none">
        <SpotlightCard className="flex h-full flex-col border border-slate-200/60 bg-white/70 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200">
          
          <div className="absolute top-4 right-4 z-30 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg">
              <ArrowUpRight size={20} />
            </div>
          </div>

          <div className="relative aspect-square w-full overflow-hidden p-3 z-10">
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-slate-50 transition-colors duration-500 group-hover:bg-blue-50/50">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-300">
                  NO MEDIA
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-1 flex-col p-6 pt-4 z-10">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {status && (
                  <Badge
                    className={cn(
                      'border-transparent shadow-sm px-3 py-1',
                      status.toLowerCase() === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", status.toLowerCase() === 'available' ? 'bg-emerald-500' : 'bg-slate-400')} />
                    {status}
                  </Badge>
                )}
                {condition && (
                  <Badge className="border-slate-200 bg-white text-slate-600 shadow-sm px-3 py-1">
                    {condition}
                  </Badge>
                )}
              </div>
              <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-900 transition-colors group-hover:text-blue-600">
                {title}
              </h3>
            </div>
            
            <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4">
              <div className="text-3xl font-black tracking-tighter text-slate-900">
                {formatMoney(price)}
              </div>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </TiltCard>
  );
}