import { Body, Controller, Patch, Post } from '@nestjs/common';
import { RepricerV2Service } from './repricer-v2.service';

@Controller('repricer-v2')
export class RepricerV2Controller {
  constructor(private readonly repricer: RepricerV2Service) {}

  @Post('analyze')
  analyze(
    @Body()
    body: {
      inventoryItemId: string;
      targetRoiPercent?: number | null;
      mode?: 'fast_sale' | 'balanced' | 'premium' | null;
    },
  ): Promise<unknown> {
    return this.repricer.analyze(body);
  }

  @Patch('apply')
  apply(
    @Body()
    body: {
      inventoryItemId: string;
      price: number;
    },
  ): Promise<unknown> {
    return this.repricer.apply(body);
  }
}