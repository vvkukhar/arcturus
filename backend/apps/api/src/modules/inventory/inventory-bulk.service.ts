import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class InventoryBulkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async bulkDelete(ids: string[]): Promise<unknown> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('ids are required');
    }

    const result = await this.prisma.inventoryItem.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    this.realtime.emitInventoryRefresh({
      ids,
      deleted: true,
      count: result.count,
    });
    this.realtime.emitDashboardRefresh('inventory_bulk_delete');

    return result;
  }
}