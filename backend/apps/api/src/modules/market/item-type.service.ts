import { Injectable } from '@nestjs/common';

export type ItemType = 'set' | 'minifigure' | 'bundle' | 'unknown';

@Injectable()
export class ItemTypeService {
  detect(title: string): ItemType {
    const normalized = title.toLowerCase();

    if (
      normalized.includes('minifigure') ||
      normalized.includes('minifig') ||
      normalized.includes('figure') ||
      normalized.includes('фігур') ||
      normalized.includes('мініфіг')
    ) {
      return 'minifigure';
    }

    if (
      normalized.includes('bundle') ||
      normalized.includes('lot') ||
      normalized.includes('collection') ||
      normalized.includes('комплект') ||
      normalized.includes('колекц')
    ) {
      return 'bundle';
    }

    if (/\b\d{4,7}\b/.test(normalized)) {
      return 'set';
    }

    return 'unknown';
  }
}