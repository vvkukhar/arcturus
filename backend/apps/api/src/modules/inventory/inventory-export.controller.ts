import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { InventoryExportService } from './inventory-export.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('inventory-export')
export class InventoryExportController {
  constructor(private readonly service: InventoryExportService) {}

  @Get()
  exportInventory(): Promise<unknown[]> {
    return this.service.exportInventory();
  }
}