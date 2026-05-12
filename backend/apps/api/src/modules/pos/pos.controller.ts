import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PosService } from './pos.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post('checkout')
  async checkout(
    @Body() body: {
      items: { inventoryItemId: string; quantity: number; price: number }[];
      paymentMethod: 'cash' | 'card' | 'crypto';
      customerContact?: string;
    },
  ) {
    return this.posService.processCheckout(body);
  }

  @Post('scan')
  async scanBarcode(@Body() body: { barcode: string }) {
    return this.posService.findItemByBarcode(body.barcode);
  }
}