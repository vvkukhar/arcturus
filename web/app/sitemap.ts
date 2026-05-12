import { MetadataRoute } from 'next';
import { appConfig } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(`${appConfig.apiBaseUrl}/public/catalog?limit=5000`, { next: { revalidate: 3600 } });
  const items = res.ok ? await res.json() : [];

  const urls: MetadataRoute.Sitemap = [
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/catalog`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/delivery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/sell`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  items.forEach((item: any) => {
    const slug = item.titleSnapshot.toLowerCase().replace(/[^\p{L}\p{N}\s-]+/gu, '').replace(/\s+/g, '-').replace(/-+/g, '-') || item.id;
    urls.push({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/catalog/${slug}`,
      lastModified: new Date(item.updatedAt || new Date()),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  });

  return urls;
}