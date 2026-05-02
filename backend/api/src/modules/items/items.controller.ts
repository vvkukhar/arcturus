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
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  list(
    @Query('q') q?: string,
    @Query('kind') kind?: string,
    @Query('theme') theme?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.itemsService.list({
      q,
      kind,
      theme,
      limit: limit ? Number(limit) : 100,
    });
  }

  @Get('stats')
  stats(): Promise<unknown> {
    return this.itemsService.stats();
  }

  @Get('themes')
  themes(): Promise<string[]> {
    return this.itemsService.themes();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<unknown> {
    return this.itemsService.getById(id);
  }

  @Post()
  create(@Body() body: CreateItemDto): Promise<unknown> {
    return this.itemsService.create(body);
  }

  @Patch()
  update(@Body() body: UpdateItemDto): Promise<unknown> {
    return this.itemsService.update(body);
  }

  @Delete()
  delete(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.itemsService.delete(body.id);
  }
}