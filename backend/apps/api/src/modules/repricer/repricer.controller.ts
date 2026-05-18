import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RepricerV2Service } from './repricer-v2.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('repricer')
export class RepricerController {
  constructor(private readonly repricerV2Service: RepricerV2Service) {}

  @Post('analyze')
  async analyze(
    @Body()
    body: {
      inventoryItemId: string;
      targetRoiPercent?: number | null;
      mode?: 'fast_sale' | 'balanced' | 'premium' | null;
    },
  ): Promise<unknown> {
    // Делегуємо аналіз потужному ядру V2
    return this.repricerV2Service.analyze({
      inventoryItemId: body.inventoryItemId,
      targetRoiPercent: body.targetRoiPercent ?? 40,
      mode: body.mode ?? 'balanced',
    });
  }

  @Post('analyze-from-comps')
  async analyzeFromComps(
    @Body()
    body: {
      inventoryItemId: string;
      targetRoiPercent?: number | null;
      mode?: 'fast_sale' | 'balanced' | 'premium' | null;
    },
  ): Promise<unknown> {
    return this.repricerV2Service.analyze({
      inventoryItemId: body.inventoryItemId,
      targetRoiPercent: body.targetRoiPercent ?? 40,
      mode: body.mode ?? 'balanced',
    });
  }

  @Patch('apply')
  async apply(
    @Body()
    body: {
      inventoryItemId: string;
      suggestedPrice?: number; // Фронтенд надсилає suggestedPrice
      price?: number; 
    },
  ): Promise<unknown> {
    // Адаптуємо пейлоад фронтенду під вимоги V2 сервісу
    return this.repricerV2Service.apply({
      inventoryItemId: body.inventoryItemId,
      price: body.price ?? body.suggestedPrice ?? 0,
    });
  }
}