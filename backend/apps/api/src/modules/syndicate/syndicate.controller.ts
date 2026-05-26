import { Controller, Get, Post, Body, Req, UseGuards, Param, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
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

  @UseGuards(JwtAuthGuard)
  @Post('payout')
  requestPayout(@Req() req: any) {
    return this.syndicate.requestAffiliatePayout(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/pending')
  getPendingPayouts() {
    return this.syndicate.getPendingAffiliatePayouts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/payout/:id')
  approvePayout(@Param('id') id: string) {
    return this.syndicate.approvePayout(id);
  }
}