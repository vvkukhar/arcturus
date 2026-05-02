import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { PurchaseFlowService } from './purchase-flow.service';

@Controller('flows/purchase')
export class PurchaseFlowController {
  constructor(private readonly service: PurchaseFlowService) {}

  @Get()
  async getItems(
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.service.list({
      status,
      q,
      limit: limit ? Number(limit) : 200,
    });
  }

  @Get('export')
  async exportRows(): Promise<unknown[]> {
    return this.service.exportRows();
  }

  @Post('add')
  async add(
    @Body()
    body: {
      watchlistItemId: string;
      selectedPrice?: number;
      selectedSource?: string;
    },
  ): Promise<unknown> {
    return this.service.add(body);
  }

  @Post('bulk-add')
  async bulkAdd(
    @Body()
    body: {
      watchlistItemIds: string[];
    },
  ): Promise<unknown> {
    return this.service.bulkAdd(body.watchlistItemIds ?? []);
  }

  @Patch('mark-bought')
  async markBought(
    @Body()
    body: {
      id: string;
      purchasePrice: number;
      quantity: number;
      extraCosts?: number;
      condition?: string;
      completenessPercent?: number;
      sealed?: boolean;
      notes?: string;
    },
  ): Promise<unknown> {
    return this.service.markBought(body);
  }

  @Patch('remove')
  async remove(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.service.remove(body.id);
  }

  @Patch('bulk-remove')
  async bulkRemove(
    @Body()
    body: {
      ids: string[];
    },
  ): Promise<unknown> {
    return this.service.bulkRemove(body.ids ?? []);
  }
}