import { CatalogItem } from './catalog.model';
import { generateId } from '../lib/utils';
import { Op } from 'sequelize';

export class CatalogService {
  async create(data: Partial<CatalogItem>) {
    return CatalogItem.create({ id: generateId(), ...data });
  }

  async list(params?: { q?: string; type?: string; theme?: string; availableOnly?: boolean; sort?: string }) {
    const where: any = {};

    if (params?.q) {
      where.title = { [Op.iLike]: `%${params.q}%` };
    }

    if (params?.type) {
      where.type = params.type;
    }

    if (params?.theme) {
      where.theme = params.theme;
    }

    if (params?.availableOnly) {
      where.status = 'available';
    }

    let order: any = [['createdAt', 'DESC']];
    if (params?.sort === 'price_asc') order = [['price', 'ASC']];
    if (params?.sort === 'price_desc') order = [['price', 'DESC']];
    if (params?.sort === 'title_asc') order = [['title', 'ASC']];

    return CatalogItem.findAll({ where, order });
  }

  async getBySlug(slug: string) {
    return CatalogItem.findOne({ where: { slug } });
  }

  async update(slug: string, data: Partial<CatalogItem>) {
    const item = await CatalogItem.findOne({ where: { slug } });
    if (!item) throw new Error('Item not found');
    return item.update(data);
  }

  async delete(slug: string) {
    const item = await CatalogItem.findOne({ where: { slug } });
    if (!item) throw new Error('Item not found');
    return item.destroy();
  }
}