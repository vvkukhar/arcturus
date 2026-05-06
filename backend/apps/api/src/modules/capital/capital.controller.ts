import { Body, Controller, Get, Post } from '@nestjs/common';
import { CapitalService } from './capital.service';

@Controller('capital')
export class CapitalController {
  constructor(private readonly capital: CapitalService) {}

  @Get('snapshot')
  snapshot(): Promise<unknown> {
    return this.capital.getSnapshot();
  }

  @Post('simulate')
  simulate(
    @Body()
    body: {
      capital: number;
      maxItems?: number;
    },
  ): Promise<unknown> {
    return this.capital.simulate({
      capital: body.capital,
      maxItems: body.maxItems ?? 10,
    });
  }
}