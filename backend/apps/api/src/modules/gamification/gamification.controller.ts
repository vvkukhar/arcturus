import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamification: GamificationService) {}

  @Get('leaderboard')
  getLeaderboard() {
    return this.gamification.getLeaderboard(20);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-rewards')
  getMyRewards(@Req() req: any) {
    return this.gamification.getMyRewards(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy-promo')
  buyPromoCode(@Req() req: any, @Body() body: { discountPercent: number }) {
    return this.gamification.buyPromoCode(req.user.id, body.discountPercent);
  }
}