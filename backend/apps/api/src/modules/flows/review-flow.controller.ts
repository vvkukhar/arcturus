import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ReviewFlowService } from './review-flow.service';

@Controller('flows/review')
export class ReviewFlowController {
  constructor(private readonly service: ReviewFlowService) {}

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
      reason?: string;
    },
  ): Promise<unknown> {
    return this.service.add(body);
  }

  @Post('bulk-add')
  async bulkAdd(
    @Body()
    body: {
      inventoryItemIds: string[];
      reason?: string;
    },
  ): Promise<unknown> {
    return this.service.bulkAdd(body.inventoryItemIds ?? [], body.reason);
  }

  @Patch('mark-reviewed')
  async markReviewed(
    @Body()
    body: {
      id: string;
      note?: string;
    },
  ): Promise<unknown> {
    return this.service.markReviewed(body);
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