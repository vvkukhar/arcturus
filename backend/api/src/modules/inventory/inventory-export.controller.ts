import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { InventoryService } from './inventory.service';

@Controller('inventory')
@UseGuards(AuthGuard)
export class InventoryExportController {
  constructor(private readonly service: InventoryService) {}

  @Get('export')
  exportInventory(): Promise<unknown[]> {
    return this.service.exportInventory();
  }
}