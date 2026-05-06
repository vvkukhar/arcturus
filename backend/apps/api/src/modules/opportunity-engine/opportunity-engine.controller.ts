import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OpportunityEngineService } from './opportunity-engine.service';

@Controller('opportunity-engine')
export class OpportunityEngineController {
  constructor(private readonly service: OpportunityEngineService) {}

  @Get('scan')
  async scan(
    @Query('limit') limit?: string,
  ): Promise<unknown> {
    return this.service.scan({
      limit: limit ? Number(limit) : 50,
      autoQueue: false,
    });
  }

  @Post('scan')
  async scanWithOptions(
    @Body()
    body: {
      limit?: number;
      autoQueue?: boolean;
      minScore?: number;
    },
  ): Promise<unknown> {
    return this.service.scan({
      limit: body.limit ?? 50,
      autoQueue: body.autoQueue ?? false,
      minScore: body.minScore ?? 75,
    });
  }
}