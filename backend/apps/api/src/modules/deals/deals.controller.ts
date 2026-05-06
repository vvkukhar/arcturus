import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DealsService } from './deals.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  list(
    @Query('status') status?: string,
    @Query('action') action?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.dealsService.list({
      status,
      action,
      limit: limit ? Number(limit) : 100,
    });
  }

  @Get('stats')
  stats(): Promise<unknown> {
    return this.dealsService.stats();
  }

  @Post('detect')
  detect(): Promise<unknown[]> {
    return this.dealsService.detectDeals();
  }

  @Patch('status')
  updateStatus(
    @Body()
    body: {
      id: string;
      status: string;
    },
  ): Promise<unknown> {
    return this.dealsService.updateStatus(body);
  }
}