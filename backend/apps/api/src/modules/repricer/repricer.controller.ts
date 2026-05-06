import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RepricerService } from './repricer.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('repricer')
export class RepricerController {
  constructor(private readonly repricerService: RepricerService) {}

  @Post('analyze')
  analyze(
    @Body()
    body: {
      inventoryItemId: string;
      marketFloor?: number | null;
      marketAverage?: number | null;
      marketCeiling?: number | null;
      targetRoiPercent?: number | null;
    },
  ): Promise<unknown> {
    return this.repricerService.analyze(body);
  }

  @Post('analyze-from-comps')
  analyzeFromComps(
    @Body()
    body: {
      inventoryItemId: string;
      targetRoiPercent?: number | null;
    },
  ): Promise<unknown> {
    return this.repricerService.analyzeFromComps(body);
  }

  @Patch('apply')
  apply(
    @Body()
    body: {
      inventoryItemId: string;
      suggestedPrice: number;
    },
  ): Promise<unknown> {
    return this.repricerService.apply(body);
  }
}