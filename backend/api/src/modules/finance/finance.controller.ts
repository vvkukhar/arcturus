import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UnitEconomicsService } from './unit-economics.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('finance')
export class FinanceController {
  constructor(private readonly unitEconomicsService: UnitEconomicsService) {}

  @Get('item/:id')
  item(@Param('id') id: string): Promise<unknown> {
    return this.unitEconomicsService.perItem(id);
  }

  @Get('best')
  best(): Promise<unknown[]> {
    return this.unitEconomicsService.bestItems();
  }

  @Get('worst')
  worst(): Promise<unknown[]> {
    return this.unitEconomicsService.worstItems();
  }

  @Get('inventory-risk')
  inventoryRisk(): Promise<unknown[]> {
    return this.unitEconomicsService.inventoryRisk();
  }
}