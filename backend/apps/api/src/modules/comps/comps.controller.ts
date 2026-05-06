import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CompsService, SoldCompInput } from './comps.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('comps')
export class CompsController {
  constructor(private readonly compsService: CompsService) {}

  @Get('sold')
  list(
    @Query('q') q?: string,
    @Query('sourceCode') sourceCode?: string,
    @Query('extractedSetNo') extractedSetNo?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.compsService.list({
      q,
      sourceCode,
      extractedSetNo,
      limit: limit ? Number(limit) : 100,
    });
  }

  @Post('ingest')
  ingest(
    @Body()
    body: {
      sourceCode: string;
      comps: SoldCompInput[];
    },
  ): Promise<unknown[]> {
    return this.compsService.ingest(body);
  }

  @Post('summary')
  summary(
    @Body()
    body: {
      itemId?: string;
      setNumber?: string;
      title?: string;
    },
  ): Promise<unknown> {
    return this.compsService.summary(body);
  }
}