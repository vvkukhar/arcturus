import {
  Body,
  Controller,
  Delete,
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
import { CreateWatchlistItemDto } from './dto/create-watchlist-item.dto';
import { UpdateWatchlistItemDto } from './dto/update-watchlist-item.dto';
import { WatchlistService } from './watchlist.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly service: WatchlistService) {}

  @Get()
  async getWatchlist(
    @Query('q') q?: string,
    @Query('active') active?: string,
    @Query('assignedUserId') assignedUserId?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.service.list({
      q,
      active:
        active === undefined || active === 'all'
          ? undefined
          : active === 'true',
      assignedUserId,
      limit: limit ? Number(limit) : 300,
    });
  }

  @Get('stats')
  stats(): Promise<unknown> {
    return this.service.stats();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<unknown> {
    return this.service.getById(id);
  }

  @Post()
  async createWatchlist(
    @Body() body: CreateWatchlistItemDto,
  ): Promise<unknown> {
    return this.service.create(body);
  }

  @Patch()
  async updateWatchlist(
    @Body() body: UpdateWatchlistItemDto,
  ): Promise<unknown> {
    return this.service.update(body.id, body);
  }

  @Delete()
  async deleteWatchlist(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.service.delete(body.id);
  }

  @Patch('bulk-activate')
  async bulkActivateWatchlist(
    @Body()
    body: {
      ids: string[];
      active: boolean;
    },
  ): Promise<unknown> {
    return this.service.bulkActivate(body.ids ?? [], body.active);
  }

  @Delete('bulk-delete')
  async bulkDeleteWatchlist(
    @Body()
    body: {
      ids: string[];
    },
  ): Promise<unknown> {
    return this.service.bulkDelete(body.ids ?? []);
  }
}