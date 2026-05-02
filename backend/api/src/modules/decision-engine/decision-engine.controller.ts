import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DecisionActionService } from './decision-action.service';
import { DecisionEngineService } from './decision-engine.service';
import { EvaluateBuyDto } from './dto/evaluate-buy.dto';
import { EvaluateInventoryDto } from './dto/evaluate-inventory.dto';
import { ExecuteDecisionDto } from './dto/execute-decision.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('decision-engine')
export class DecisionEngineController {
  constructor(
    private readonly decisionEngineService: DecisionEngineService,
    private readonly decisionActionService: DecisionActionService,
  ) {}

  @Post('buy')
  evaluateBuy(@Body() body: EvaluateBuyDto): Promise<unknown> {
    return this.decisionEngineService.evaluateBuy(body);
  }

  @Post('inventory')
  evaluateInventory(@Body() body: EvaluateInventoryDto): Promise<unknown> {
    return this.decisionEngineService.evaluateInventory(body);
  }

  @Patch('execute')
  execute(@Body() body: ExecuteDecisionDto): Promise<unknown> {
    return this.decisionActionService.execute(
      body.decisionSnapshotId,
      body.note ?? null,
    );
  }

  @Patch('ignore')
  ignore(@Body() body: ExecuteDecisionDto): Promise<unknown> {
    return this.decisionActionService.ignore(
      body.decisionSnapshotId,
      body.note ?? null,
    );
  }

  @Patch('review')
  review(@Body() body: ExecuteDecisionDto): Promise<unknown> {
    return this.decisionActionService.markReviewed(
      body.decisionSnapshotId,
      body.note ?? null,
    );
  }

  @Patch('execute-top')
  executeTop(@Body() body: { limit?: number }): Promise<unknown> {
    return this.decisionActionService.executeTopPending(body.limit ?? 20);
  }

  @Patch('sweep/inventory')
  inventorySweep(): Promise<unknown> {
    return this.decisionEngineService.runInventorySweep();
  }

  @Patch('sweep/buy')
  buySweep(): Promise<unknown> {
    return this.decisionEngineService.runBuySweep();
  }

  @Get('latest')
  latest(
    @Query('contextType') contextType?: string,
    @Query('action') action?: string,
    @Query('executionStatus') executionStatus?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.decisionEngineService.latest({
      contextType,
      action,
      executionStatus,
      limit: limit ? Number(limit) : 100,
    });
  }
}