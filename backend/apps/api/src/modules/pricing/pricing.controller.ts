import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PricingService } from './pricing.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('analyze')
  analyze(
    @Body()
    body: {
      buyPrice: number;
      sellPrice?: number | null;
      marketFloor?: number | null;
      marketAverage?: number | null;
      targetRoiPercent?: number | null;
    },
  ): unknown {
    return this.pricingService.analyze(body);
  }
}