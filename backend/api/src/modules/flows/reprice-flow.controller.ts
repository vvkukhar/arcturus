import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { RepriceFlowService } from './reprice-flow.service';

@Controller('flows/reprice')
export class RepriceFlowController {
  constructor(private readonly service: RepriceFlowService) {}

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
      inventoryItemId: string;
      suggestedPrice?: number;
    },
  ): Promise<unknown> {
    return this.service.add(body);
  }

  @Post('bulk-add')
  async bulkAdd(
    @Body()
    body: {
      inventoryItemIds: string[];
    },
  ): Promise<unknown> {
    return this.service.bulkAdd(body.inventoryItemIds ?? []);
  }

  @Patch('mark-listed')
  async markListed(
    @Body()
    body: {
      id: string;
      price: number;
    },
  ): Promise<unknown> {
    return this.service.markListed(body);
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