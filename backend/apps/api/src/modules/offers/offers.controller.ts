import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OffersService } from './offers.service';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Req() req: any, @Body() body: { inventoryItemId: string; amount: number; message?: string }) {
    return this.offersService.createOffer(req.user.id, body);
  }

  @Get('my-offers')
  getMyOffers(@Req() req: any) {
    return this.offersService.getMyOffers(req.user.id);
  }

  @Get('incoming')
  getIncomingOffers(@Req() req: any) {
    return this.offersService.getOffersForMyItems(req.user.id);
  }

  @Patch(':id/respond')
  respond(@Req() req: any, @Param('id') id: string, @Body() body: { action: 'accept' | 'reject' }) {
    return this.offersService.respondToOffer(req.user.id, id, body.action);
  }
}