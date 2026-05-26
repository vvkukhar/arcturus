import { Controller, Get, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { DropshipService } from './dropship.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dropship')
export class DropshipController {
  constructor(private readonly dropshipService: DropshipService) {}

  @Get('catalog')
  async getWholesaleCatalog(@Req() req: any) {
    if (req.user.role !== 'dropshipper' && req.user.role !== 'admin') {
      throw new UnauthorizedException('Dropshipper access required');
    }
    return this.dropshipService.getWholesaleCatalog();
  }

  @Post('order')
  async createDropshipOrder(@Req() req: any, @Body() body: any) {
    if (req.user.role !== 'dropshipper' && req.user.role !== 'admin') {
      throw new UnauthorizedException('Dropshipper access required');
    }
    return this.dropshipService.createOrder(req.user.id, body);
  }
}