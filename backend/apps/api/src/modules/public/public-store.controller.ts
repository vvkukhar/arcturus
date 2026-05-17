import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PublicStoreService } from './public-store.service';

@Controller('public')
export class PublicStoreController {
  constructor(private readonly publicStoreService: PublicStoreService) {}

  @Get('catalog')
  getCatalog(
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('theme') theme?: string,
    @Query('sort') sort?: string,
    @Query('availableOnly') availableOnly?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.publicStoreService.getCatalog({
      q,
      type,
      theme,
      sort,
      availableOnly: availableOnly === 'true',
      limit: limit ? Number(limit) : 200,
    });
  }

  @Get('catalog/:slug')
  getCatalogItem(@Param('slug') slug: string): Promise<unknown> {
    return this.publicStoreService.getCatalogItemBySlug(slug);
  }

  @Get('analytics')
  analytics(): Promise<unknown> {
    return this.publicStoreService.getStoreAnalytics();
  }

  @Get('track/:query')
  trackOrder(@Param('query') query: string): Promise<unknown> {
    return this.publicStoreService.trackOrder(query);
  }

  @Post('reserve')
  createReserve(
    @Body()
    body: {
      inventoryItemId?: string | null;
      productTitle?: string;
      name: string;
      contact: string;
      message?: string | null;
    },
  ): Promise<unknown> {
    return this.publicStoreService.createReserve(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Get('reserve-requests')
  listReserveRequests(
    @Query('q') q?: string,
    @Query('status') status?: string,
  ): Promise<unknown[]> {
    return this.publicStoreService.getReserveRequests({
      q,
      status,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Get('reserve-requests/:id')
  getReserveRequest(@Param('id') id: string): Promise<unknown> {
    return this.publicStoreService.getReserveRequest(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Patch('reserve-requests')
  updateReserveRequest(
    @Body()
    body: {
      id: string;
      status?: string;
      adminNote?: string | null;
    },
  ): Promise<unknown> {
    return this.publicStoreService.updateReserveRequest(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @Get('reserve-board')
  reserveBoard(): Promise<unknown> {
    return this.publicStoreService.getReserveBoard();
  }
}