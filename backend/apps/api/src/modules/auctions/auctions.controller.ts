import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuctionsService } from './auctions.service';

@Controller('public/auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  getActiveAuctions() {
    return this.auctionsService.getActiveAuctions();
  }

  @Get(':id')
  getAuctionById(@Param('id') id: string) {
    return this.auctionsService.getAuctionById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Req() req: any, @Body() body: { inventoryItemId: string; startPrice: number; durationMinutes: number }) {
    return this.auctionsService.createAuction(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/bid')
  bid(@Req() req: any, @Param('id') id: string, @Body() body: { amount: number }) {
    return this.auctionsService.placeBid(req.user.id, id, body.amount);
  }
}