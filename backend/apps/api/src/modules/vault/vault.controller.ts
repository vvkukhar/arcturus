import { Controller, Get, Post, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProGuard } from '../auth/pro.guard';
import { VaultService } from './vault.service';

@UseGuards(JwtAuthGuard, ProGuard)
@Controller('vault')
export class VaultController {
  constructor(private readonly vault: VaultService) {}

  @Get('balance')
  getBalance(@Req() req: any) {
    return this.vault.getBalance(req.user.id);
  }

  @Get('portfolio')
  getPortfolio(@Req() req: any) {
    return this.vault.getInvestorPortfolio(req.user.id);
  }

  @Post('deposit')
  deposit(@Req() req: any, @Body() body: { amount: number }) {
    if (!body.amount || body.amount < 1000) throw new BadRequestException('Minimum deposit is 1000 UAH');
    return this.vault.createDepositLink(req.user.id, body.amount);
  }

  @Post('invest')
  investInDeal(@Req() req: any, @Body() body: { dealId: string }) {
    return this.vault.investInDeal(req.user.id, body.dealId);
  }
}