import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LiveService } from './live.service';

@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Get('active')
  getActiveStream() {
    return this.liveService.getActiveStream();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Post('start')
  startStream(@Body() body: { title: string; videoUrl?: string }) {
    return this.liveService.startStream(body.title, body.videoUrl);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Post('stop/:streamId')
  stopStream(@Param('streamId') streamId: string) {
    return this.liveService.stopStream(streamId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Post('auction/start')
  startAuction(@Body() body: { streamId: string; inventoryItemId: string; startPrice: number }) {
    return this.liveService.startQuickAuction(body.streamId, body.inventoryItemId, body.startPrice);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auction/:auctionId/ticket')
  buyTicket(@Req() req: any, @Param('auctionId') auctionId: string) {
    return this.liveService.buyAuctionTicket(req.user.id, auctionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auction/:auctionId/bid')
  placeBid(@Req() req: any, @Param('auctionId') auctionId: string, @Body() body: { amount: number }) {
    return this.liveService.placeBid(req.user.id, auctionId, body.amount);
  }
}