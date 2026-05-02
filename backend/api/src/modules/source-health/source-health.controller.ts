import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SourceHealthService } from './source-health.service';
import { SourceRerunService } from './source-rerun.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('source-health')
export class SourceHealthController {
  constructor(
    private readonly sourceHealthService: SourceHealthService,
    private readonly sourceRerunService: SourceRerunService,
  ) {}

  @Get('summary')
  async getSourceHealthSummary(): Promise<unknown[]> {
    return this.sourceHealthService.getSourceHealthSummary();
  }

  @Get('runs')
  async getRecentRunHistory(
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.sourceHealthService.getRecentRunHistory(
      limit ? Number(limit) : 30,
    );
  }

  @Get('runs/:runId')
  async getRunById(@Param('runId') runId: string): Promise<unknown> {
    return this.sourceHealthService.getRunById(runId);
  }

  @Get('errors')
  async getRecentSyncErrors(
    @Query('limit') limit?: string,
    @Query('sourceCode') sourceCode?: string,
  ): Promise<unknown[]> {
    return this.sourceHealthService.getRecentSyncErrors(
      limit ? Number(limit) : 50,
      sourceCode,
    );
  }

  @Get('sources/:sourceCode')
  async getSourceDetail(
    @Param('sourceCode') sourceCode: string,
  ): Promise<unknown> {
    return this.sourceHealthService.getSourceDetail(sourceCode);
  }

  @Post('rerun')
  async triggerSourceRerun(
    @Body()
    body: {
      sourceCode: string;
    },
  ): Promise<unknown> {
    return this.sourceRerunService.triggerSourceRerun(body.sourceCode);
  }

  @Patch('source/enabled')
  async toggleSource(
    @Body()
    body: {
      sourceCode: string;
      enabled: boolean;
    },
  ): Promise<unknown> {
    return this.sourceRerunService.toggleSource(body.sourceCode, body.enabled);
  }
}