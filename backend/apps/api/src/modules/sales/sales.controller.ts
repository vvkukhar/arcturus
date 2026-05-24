import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SalesService } from './sales.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  list(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<unknown[]> {
    return this.salesService.list({
      q,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
    });
  }

  @Get('payouts/pending')
  getPendingPayouts() {
    return this.salesService.getPendingPayouts();
  }

  @Patch('payouts/:id/pay')
  markPayoutPaid(@Param('id') id: string) {
    return this.salesService.markPayoutPaid(id);
  }

  @Get('stats')
  stats(): Promise<unknown> {
    return this.salesService.stats();
  }

  @Post()
  registerSale(
    @Body()
    body: {
      inventoryItemId: string;
      sellPrice: number;
      quantity?: number;
      channel?: string | null;
      buyerName?: string | null;
      notes?: string | null;
    },
  ): Promise<unknown> {
    return this.salesService.registerSale(body);
  }

  @Delete()
  deleteSale(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.salesService.deleteSale(body.id);
  }
}