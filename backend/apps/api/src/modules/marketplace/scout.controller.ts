import { Body, Controller, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ScoutService } from './scout.service';

@Controller('scout')
export class ScoutController {
  constructor(private readonly scoutService: ScoutService) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  submitLead(@Req() req: any, @Body() body: { url: string; notes?: string }) {
    return this.scoutService.submitLead(req.user.id, body.url, body.notes);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-leads')
  getMyLeads(@Req() req: any) {
    return this.scoutService.getMyLeads(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('active-surges')
  getActiveSurges() {
    return this.scoutService.getActiveSurges();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Get('leads')
  getAllLeads() {
    return this.scoutService.getAllLeads();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Patch('reject/:id')
  rejectLead(@Param('id') id: string, @Body() body: { adminNote?: string }) {
    return this.scoutService.rejectLead(id, body.adminNote);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Patch('reward/:id')
  approveAndRewardLead(@Param('id') id: string, @Body() body: { rewardAmount: number }) {
    return this.scoutService.approveLead(id, body.rewardAmount);
  }
}