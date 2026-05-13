import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class RebrickableSyncService {
  private readonly logger = new Logger(RebrickableSyncService.name);
  private readonly apiKey = process.env.REBRICKABLE_API_KEY;
  private readonly baseUrl = 'https://rebrickable.com/api/v3/lego';

  constructor(private readonly prisma: PrismaService) {}

  async syncMasterCatalog(type: 'sets' | 'minifigs' = 'sets'): Promise<{ inserted: number; updated: number }> {
    if (!this.apiKey) {
      throw new Error('REBRICKABLE_API_KEY is not configured');
    }

    let nextUrl: string | null = `${this.baseUrl}/${type}/?page_size=500`;
    let inserted = 0;
    let updated = 0;

    while (nextUrl) {
      try {
        const response = await axios.get(nextUrl, {
          headers: {
            Authorization: `key ${this.apiKey}`,
            Accept: 'application/json',
          },
        });

        const data = response.data;
        const items = data.results;
        const dbOperations = [];

        for (const item of items) {
          const setNumber = type === 'sets' ? item.set_num : item.set_num;
          const title = item.name;
          const imageUrl = item.set_img_url;
          const year = item.year;
          const kind = type === 'sets' ? 'set' : 'minifigure';

          dbOperations.push(
            this.prisma.item.upsert({
              where: {
                setNumber_kind: { setNumber, kind } 
              },
              update: {
                title,
                imageUrl,
                notes: year ? `Released: ${year}` : null,
              },
              create: {
                title,
                setNumber,
                kind,
                imageUrl,
                conditionDefault: 'used',
                notes: year ? `Released: ${year}` : null,
              },
            })
          );
        }

        if (dbOperations.length > 0) {
          const results = await this.prisma.$transaction(dbOperations);
          inserted += results.filter(r => r.createdAt.getTime() === r.updatedAt.getTime()).length;
          updated += results.length - inserted;
        }

        nextUrl = data.next;
        
        await new Promise((res) => setTimeout(res, 1100));

      } catch (error) {
        this.logger.error(`Failed to sync ${type} catalog at URL: ${nextUrl}`, error);
        break;
      }
    }

    this.logger.log(`Catalog sync complete for ${type}. Inserted: ${inserted}, Updated: ${updated}`);
    return { inserted, updated };
  }
}