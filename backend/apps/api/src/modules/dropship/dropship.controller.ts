import { Controller, Get, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { DropshipService } from './dropship.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dropship')
export class DropshipController {
  constructor(private readonly dropshipService: DropshipService) {}

  @Get('catalog')
  async getWholesaleCatalog(@Req() req: any) {
    if (!req.user.isPro && req.user.role !== 'admin' && req.user.role !== 'operator') {
      throw new UnauthorizedException('B2B Dropship access required (PRO tier)');
    }
    return this.dropshipService.getWholesaleCatalog();
  }

  @Post('order')
  async createDropshipOrder(@Req() req: any, @Body() body: any) {
    if (!req.user.isPro && req.user.role !== 'admin' && req.user.role !== 'operator') {
      throw new UnauthorizedException('B2B Dropship access required (PRO tier)');
    }
    return this.dropshipService.createOrder(req.user.id, body);
  }
}