import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolio: PortfolioService) {}

  @Get('summary')
  getSummary(): Promise<unknown> {
    return this.portfolio.getSummary();
  }

  @Get('inventory-value')
  getInventoryValue(): Promise<unknown> {
    return this.portfolio.getInventoryValue();
  }

  @Get('capital-plan')
  getCapitalPlan(
    @Query('capital') capital?: string,
  ): Promise<unknown> {
    return this.portfolio.getCapitalPlan(capital ? Number(capital) : 0);
  }

  @Post('capital-plan')
  createCapitalPlan(
    @Body()
    body: {
      capital: number;
    },
  ): Promise<unknown> {
    return this.portfolio.getCapitalPlan(body.capital);
  }
}