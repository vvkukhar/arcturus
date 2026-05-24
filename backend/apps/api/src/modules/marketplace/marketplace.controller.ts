import { Body, Controller, Get, Param, Patch, Post, UseGuards, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplace: MarketplaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('apply')
  submitApplication(
    @Req() req: any, 
    @Body() body: { itemId: string; expectedPrice: number; notes?: string; tradeType: 'c2c' | 'c2b' }
  ) {
    return this.marketplace.submitApplication({ ...body, sellerId: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/upload')
  @UseInterceptors(FilesInterceptor('files', 5)) // Дозволяємо до 5 фоток
  uploadImages(
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.marketplace.uploadImages(id, req.user.id, files);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-listings')
  getMyListings(@Req() req: any) {
    return this.marketplace.getMyListings(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Get('queue')
  getQueue() {
    return this.marketplace.getPendingQueue();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Patch('approve/:id')
  approve(@Param('id') id: string) {
    return this.marketplace.approveListing(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Patch('reject/:id')
  reject(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.marketplace.rejectListing(id, body.reason);
  }
}