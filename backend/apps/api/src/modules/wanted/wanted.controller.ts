import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { WantedService } from './wanted.service';

@Controller('public/wanted')
export class WantedController {
  constructor(private readonly wantedService: WantedService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  add(@Req() req: any, @Body() body: { itemId: string; maxPrice?: number }) {
    return this.wantedService.addToWanted(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyWatchlist(@Req() req: any) {
    return this.wantedService.getMyWatchlist(req.user.id);
  }

  // НОВИЙ ЕНДПОІНТ: Тільки для адміністраторів
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Get('demand')
  getDemandHeatmap() {
    return this.wantedService.getDemandHeatmap();
  }
}