import { CatalogService } from '../catalog/catalog.service';
import { CatalogItem } from '../catalog/catalog.model';

export class PublicService {
  constructor(private catalogService = new CatalogService()) {}

  async getCatalog(params?: { q?: string; type?: string; theme?: string; sort?: string; availableOnly?: boolean }) {
    const items = await this.catalogService.list(params);
    return items.map((i) => ({
      slug: i.slug,
      title: i.title,
      price: i.price,
      condition: i.condition,
      status: i.status,
      type: i.type,
      theme: i.theme,
      imageUrl: i.imageUrl,
    }));
  }

  async getCatalogItem(slug: string) {
    const item = await this.catalogService.getBySlug(slug);
    if (!item) throw new Error('Item not found');
    return item;
  }
}