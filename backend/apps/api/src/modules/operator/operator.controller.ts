import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { OperatorService } from './operator.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('operator')
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Get('dashboard')
  async getOperatorDashboard(): Promise<unknown> {
    return this.operatorService.getOperatorDashboard();
  }

  @Get('unresolved-matches')
  async getUnresolvedMatches(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    const parsedStatus = status ?? 'pending';
    const parsedLimit = limit != null ? Number(limit) : 50;
    return this.operatorService.getUnresolvedMatches(parsedStatus, parsedLimit);
  }

  @Get('unresolved-summary')
  async getUnresolvedSummary(): Promise<unknown> {
    return this.operatorService.getUnresolvedSummary();
  }

  @Patch('resolve-match')
  async resolveMatch(
    @Body()
    body: {
      queueId: string;
      itemId: string;
      operatorNote?: string;
    },
  ): Promise<unknown> {
    return this.operatorService.resolveMatch(body);
  }

  @Patch('dismiss-match')
  async dismissMatch(
    @Body()
    body: {
      queueId: string;
      operatorNote?: string;
    },
  ): Promise<unknown> {
    return this.operatorService.dismissMatch(body);
  }

  @Patch('update-note')
  async updateOperatorNote(
    @Body()
    body: {
      queueId: string;
      operatorNote: string;
    },
  ): Promise<unknown> {
    return this.operatorService.updateOperatorNote(body);
  }
}