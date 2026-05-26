import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('catalog')
  async getCatalog(
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('theme') theme?: string,
    @Query('sort') sort?: string,
    @Query('availableOnly') availableOnly?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.publicService.getCatalog({
      q,
      type,
      theme,
      sort,
      availableOnly: availableOnly === 'true',
      limit: limit ? Number(limit) : 48,
    });
  }

  @Get('catalog/:slug')
  async getCatalogItemBySlug(
    @Param('slug') slug: string,
  ): Promise<unknown | null> {
    return this.publicService.getCatalogItemBySlug(slug);
  }

  @Get('catalog/:slug/related')
  async getRelatedCatalogItems(
    @Param('slug') slug: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.publicService.getRelatedCatalogItems({
      slug,
      limit: limit ? Number(limit) : 8,
    });
  }

  // НОВИЙ ЕНДПОІНТ
  @Get('seller/:id')
  async getSellerProfile(@Param('id') id: string): Promise<unknown> {
    return this.publicService.getSellerProfile(id);
  }

  @Post('reserve')
  async createReserveRequest(
    @Body()
    body: {
      inventoryItemId?: string;
      productTitle?: string;
      name: string;
      contact: string;
      message?: string;
    },
  ): Promise<unknown> {
    if (!body.name?.trim()) {
      throw new BadRequestException('Name is required');
    }

    if (!body.contact?.trim()) {
      throw new BadRequestException('Contact is required');
    }

    return this.publicService.createReserveRequest(body);
  }

  @Get('reserve-requests')
  async getReserveRequests(
    @Query('q') q?: string,
    @Query('status') status?: string,
  ): Promise<unknown[]> {
    return this.publicService.getReserveRequests({
      q,
      status,
    });
  }

  @Patch('reserve-requests')
  async updateReserveRequest(
    @Body()
    body: {
      id: string;
      status?: string;
      adminNote?: string | null;
    },
  ): Promise<unknown> {
    return this.publicService.updateReserveRequest(body);
  }

  @Get('reserve-board')
  async getReserveBoard(): Promise<unknown> {
    return this.publicService.getReserveBoard();
  }

  @Get('analytics')
  async getStoreAnalytics(): Promise<unknown> {
    return this.publicService.getStoreAnalytics();
  }
}