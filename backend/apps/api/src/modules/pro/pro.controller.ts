import { Controller, Get, Post, Req, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProGuard } from '../auth/pro.guard';
import { ProService } from './pro.service';

@Controller('pro')
export class ProController {
  constructor(private readonly proService: ProService) {}

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  createSubscription(@Req() req: any) {
    return this.proService.createSubscriptionPayment(req.user.id);
  }

  @Post('webhook')
  handleWebhook(@Body() body: any, @Req() req: any) {
    const signature = req.headers['x-sign'];
    if (!signature) throw new BadRequestException('Missing signature');
    return this.proService.handlePaymentWebhook(body, signature as string);
  }

  @UseGuards(JwtAuthGuard, ProGuard)
  @Get('deals')
  getProDeals(@Req() req: any) {
    return this.proService.getDeals(req.user);
  }

  @UseGuards(JwtAuthGuard, ProGuard)
  @Get('screener')
  getScreenerData(@Req() req: any) {
    return this.proService.getScreenerData(req.user);
  }
}