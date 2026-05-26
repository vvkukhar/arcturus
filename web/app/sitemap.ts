// call:function_5{"queries":["web/app/sitemap.ts"]}
import { MetadataRoute } from 'next';
import { appConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arcturus.store';
  
  const urls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/store/catalog`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/delivery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sell`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  try {
    const res = await fetch(`${appConfig.apiBaseUrl}/public/catalog?limit=5000`, { 
      next: { revalidate: 3600 } 
    });

    if (res.ok) {
      const items = await res.json();
      items.forEach((item: any) => {
        // ФІКС: Ідеальний метч slugify з бекендом
        const slug = String(item.titleSnapshot || item.item?.title || item.id)
          .trim()
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s-]+/gu, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
          
        urls.push({
          url: `${baseUrl}/store/catalog/${slug}`,
          lastModified: new Date(item.updatedAt || new Date()),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.warn('[Sitemap] API unreachable during build, falling back to static routes.');
  }

  return urls;
}