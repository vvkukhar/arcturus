import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MonetizationService } from './monetization.service';

@Controller('monetization')
export class MonetizationController {
  constructor(private readonly monetization: MonetizationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('boost')
  boostListing(@Req() req: any, @Body() body: { inventoryItemId: string; days: number }) {
    return this.monetization.buyBoost(req.user.id, body.inventoryItemId, body.days);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('mystery-boxes/generate')
  generateBoxes() {
    return this.monetization.generateMysteryBoxes();
  }

  @Get('mystery-boxes')
  getBoxes() {
    return this.monetization.getAvailableMysteryBoxes();
  }

  @UseGuards(JwtAuthGuard)
  @Post('mystery-boxes/:id/buy')
  buyBox(@Req() req: any, @Param('id') id: string) {
    return this.monetization.purchaseMysteryBox(req.user.id, id);
  }
}