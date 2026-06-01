import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SyndicateService } from './syndicate.service';

@Controller('syndicate')
export class SyndicateController {
  constructor(private readonly syndicate: SyndicateService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboard(@Req() req: any) {
    return this.syndicate.getAffiliateDashboard(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('code/generate')
  generateCode(@Req() req: any) {
    return this.syndicate.generateReferralCode(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('apply-code')
  applyCode(@Req() req: any, @Body() body: { code: string }) {
    return this.syndicate.applyReferralCode(req.user.id, body.code);
  }
}