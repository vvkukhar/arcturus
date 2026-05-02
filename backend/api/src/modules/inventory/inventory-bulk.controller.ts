import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { InventoryService } from './inventory.service';

@Controller('inventory')
@UseGuards(AuthGuard)
export class InventoryBulkController {
  constructor(private readonly service: InventoryService) {}

  @Patch('bulk-delete')
  bulkDelete(
    @Body()
    body: {
      ids: string[];
    },
  ): Promise<unknown> {
    return this.service.bulkDelete(body.ids ?? []);
  }
}