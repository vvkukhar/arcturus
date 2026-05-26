import { Controller, Get } from '@nestjs/common';
import { GamificationService } from './gamification.service';

@Controller('public/gamification')
export class GamificationController {
  constructor(private readonly gamification: GamificationService) {}

  @Get('leaderboard')
  getLeaderboard() {
    return this.gamification.getLeaderboard(20);
  }
}