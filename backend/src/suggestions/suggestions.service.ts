import { CatalogItem } from '../catalog/catalog.service';
import { generateId } from '../lib/utils';

export type SuggestionItem = {
  id: string;
  title: string;
  roi: number;
  action: string;
};

export class SuggestionService {
  async generate(items: CatalogItem[]): Promise<SuggestionItem[]> {
    return items.map((item) => ({
      id: generateId(),
      title: item.title,
      roi: Math.floor(Math.random() * 50 + 10),
      action: 'buy',
    }));
  }
}